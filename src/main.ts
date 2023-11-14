import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { exec } from 'child_process';
import fs from 'fs';

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: '*',
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await startNgrok();

  const serviceAccount = JSON.parse(fs.readFileSync('serviceAccount.json', 'utf-8'));
  admin.initializeApp({
    credential: admin.credential.cert({ ...serviceAccount }),
  });

  await app.listen(process.env.PORT, () => {
    console.log('Server running on port: ', process.env.PORT);
    console.log('Tunnel online at ', process.env.NGROK_DOMAIN);
  });
};
bootstrap();

const startNgrok = async () => {
  return new Promise(async (resolve) => {
    const isRunning = await ngrokCheckIsRunning();
    console.log(isRunning ? 'El servicio ya está corriendo en ngrok' : 'Levantando el servicio en ngrok...');
    if (!isRunning) {
      console.log('Agregando el token de ngrok...');
      await ngrokExecAddToken();
      console.log('Iniciando el tunel...');
      await ngrokExecStart();
    }
    resolve(true);
  });
};

const ngrokCheckIsRunning = async () => {
  const checkIsRunning = `ngrok api tunnels list --api-key=${process.env.NGROK_API_KEY}`;
  return new Promise((resolve, reject) => {
    exec(checkIsRunning, (error, stdout) => {
      if (error) reject(error);
      const res = JSON.parse(stdout.trim());
      resolve(res?.tunnels?.some((tunnel) => String(tunnel.public_url).endsWith(process.env.NGROK_DOMAIN)));
    });
  });
};

const ngrokExecAddToken = async () => {
  const addTokenCommand = `ngrok config add-authtoken ${process.env.NGROK_TOKEN}`;
  return new Promise((resolve, reject) => {
    exec(addTokenCommand, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout.trim());
    });
  });
};

const ngrokExecStart = async () => {
  const startTunnelCommand = `ngrok http --domain=${process.env.NGROK_DOMAIN} ${process.env.PORT}`;
  exec(startTunnelCommand);
};

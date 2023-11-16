import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

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

  const serviceAccount = JSON.parse(fs.readFileSync(path.join('serviceAccount.json'), 'utf-8'));
  admin.initializeApp({
    credential: admin.credential.cert({ ...serviceAccount }),
  });

  await app.listen(process.env.PORT, () => {
    console.log('Server running on port: ', process.env.PORT);
  });
};
bootstrap();

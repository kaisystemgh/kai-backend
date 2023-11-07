import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { getFirebaseConfig } from './common/config/FirebaseConfig';

const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));

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

  admin.initializeApp({
    credential: admin.credential.cert(getFirebaseConfig(process.env)),
  });

  return app.init();
};

//Listen
createNestServer(server).then(async (app) => {
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log('Running on port:', PORT);
});

// Deploy on GCP
// createNestServer(server);
//   .then((v) => console.log('Nest app ready!'))
//   .catch((err) => console.error('Nest broken!', err));
// export const api = functions.https.onRequest(server);

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { NotificationsModule } from './notifications/notifications.module';
import { IsAuthenticatedMiddleware } from './common/middlewares/IsAuthenticated.middleware';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.GMAIL_ACCOUNT,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
    }),
    HttpModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes('*');
  }
}

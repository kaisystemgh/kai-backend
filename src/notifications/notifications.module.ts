import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WsNotificationsService } from './ws-notifications.service';
import { NotificationsWsGateway } from './ws-notifications.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/models/User.model';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [NotificationsWsGateway, WsNotificationsService],
})
export class NotificationsModule {}

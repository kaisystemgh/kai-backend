import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WsNotificationsService } from './ws-notifications.service';
import { NotificationsWsGateway } from './ws-notifications.gateway';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [NotificationsWsGateway, WsNotificationsService],
})
export class NotificationsModule {}

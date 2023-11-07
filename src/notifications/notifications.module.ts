import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WsNotificationsService } from './ws-notifications.service';
import { NotificationsWsGateway } from './ws-notifications.gateway';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsWsGateway, WsNotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

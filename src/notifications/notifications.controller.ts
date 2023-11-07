import { Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async receiveNotification() {
    return 'recibido!';
  }
}

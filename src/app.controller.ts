import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RecoverCajaPasswordDto } from './common/dtos/RecoverCajaPassword.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('recoverCaja')
  recoverCajaPassword(@Body() data: RecoverCajaPasswordDto) {
    return this.appService.recoverCajaPassword(data);
  }
}

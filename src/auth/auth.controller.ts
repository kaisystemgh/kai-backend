import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginUserDto } from './dto/login-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('list/:client_id')
  getUsers(@Param('client_id') client_id: string) {
    return this.authService.getUsers(client_id);
  }
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('removeUser')
  removeUser(@Body() removeUserDto: RemoveUserDto) {
    return this.authService.removeUser(removeUserDto);
  }
}

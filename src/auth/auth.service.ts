import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/User.model';
import { LoginUserDto } from './dto/login-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(KAI_client_id: string) {
    const users = await this.usersModel.find({ KAI_client_id });
    return users.map((user) => user.email);
  }

  async existUser(userId: string) {
    return await this.usersModel.findById(userId);
  }

  async create(createUserDto: LoginUserDto) {
    const { password, ...rest } = createUserDto;

    const user = await this.usersModel.findOne({ email: rest.email });
    if (user) throw new ConflictException('Email address is already in use');

    await this.usersModel.create({
      ...rest,
      password: bcrypt.hashSync(password, 10),
    });

    return {
      message: 'User created.',
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.usersModel.findOne({ email });

    if (!user) throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      id: user.id,
      email,
      token: this.getJwtToken({
        user_id: user.id,
        client_id: user.KAI_client_id,
        email: user.email,
      }),
    };
  }

  async removeUser({ email }: RemoveUserDto) {
    await this.usersModel.deleteOne({ email });

    return {
      message: 'User removed successfully.',
    };
  }

  private getJwtToken(payload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}

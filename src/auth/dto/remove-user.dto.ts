import { IsEmail, IsString } from 'class-validator';

export class RemoveUserDto {
  @IsString()
  @IsEmail()
  email: string;
}

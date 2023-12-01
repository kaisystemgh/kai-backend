import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;

  @IsString()
  KAI_client_id: string;
}

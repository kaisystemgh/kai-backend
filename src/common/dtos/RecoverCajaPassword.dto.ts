import { IsString } from 'class-validator';

export class RecoverCajaPasswordDto {
  @IsString()
  defaultEmail: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}

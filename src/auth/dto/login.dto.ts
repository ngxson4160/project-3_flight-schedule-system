import { GENDER, ROLE } from '@prisma/client';
import { IsEmail, IsEnum, IsIn, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

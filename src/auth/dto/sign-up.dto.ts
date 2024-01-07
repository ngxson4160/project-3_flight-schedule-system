import { GENDER, ROLE } from '@prisma/client';
import { IsEmail, IsEnum, IsIn, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsEnum(GENDER)
  gender: GENDER;

  @IsString()
  @IsEnum(ROLE)
  role: ROLE;
}

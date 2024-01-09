import { IsNumber, IsOptional, IsString } from 'class-validator';

export class NewHelicopterDto {
  @IsString()
  name: string;

  @IsNumber()
  capacity: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  img: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  engine: string;

  @IsString()
  @IsOptional()
  speed: string;
}

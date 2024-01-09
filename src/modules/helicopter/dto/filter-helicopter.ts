import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterHelicopterDto {
  @IsString()
  name: string;

  @IsNumber()
  capacity: number;

  @IsString()
  @IsOptional()
  description: string;

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

export class OrderByHelicopterDto {
    @IsNumber()
    capacity: number;

    @IsString()
    @IsOptional()
    speed: string;
  }

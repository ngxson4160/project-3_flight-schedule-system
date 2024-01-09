import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRouteDto {
  @IsArray()
  @IsOptional()
  locations?: object;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  flightLength?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;
}

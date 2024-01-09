import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateRouteDto {
  @IsArray()
  locations: object;

  @IsNumber()
  @IsOptional()
  description?: string;

  @IsNumber()
  flightLength: number;

  @IsNumber()
  duration: number;
}

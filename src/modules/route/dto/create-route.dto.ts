import { ROUTE_TYPE } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';

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

  @IsEnum(ROUTE_TYPE)
  type: ROUTE_TYPE;
}

import { ROUTE_TYPE } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRouteDto {
  @IsString()
  name: string;

  @IsArray()
  locations: object;

  @IsNumber()
  @IsOptional()
  description?: string;

  @IsNumber()
  flightLength: number;

  @IsNumber()
  duration: number;

  @IsNumber()
  price: number;

  @IsEnum(ROUTE_TYPE)
  type: ROUTE_TYPE;
}

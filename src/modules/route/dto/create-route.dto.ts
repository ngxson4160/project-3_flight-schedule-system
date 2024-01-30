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

  @IsString()
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

export class GetListRouteDto {
  @IsEnum(() => ROUTE_TYPE)
  @IsOptional()
  type?: ROUTE_TYPE;
}

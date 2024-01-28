import { ROUTE_TYPE } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FGetAvailableResourceDto {
  @IsDateString()
  start: Date;

  @IsDateString()
  end: Date;

  @IsString()
  @IsOptional()
  routeId?: number;

  @IsString()
  @IsOptional()
  isAdventureFlight?: number;
}

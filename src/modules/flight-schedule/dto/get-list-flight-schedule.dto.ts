import { FLIGHT_SCHEDULE_STATUS, ROUTE_TYPE } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional } from 'class-validator';

export class FGetListFlightScheduleDto {
  @IsOptional()
  userId?: number;

  @IsISO8601()
  @IsOptional()
  start: Date;

  @IsISO8601()
  @IsOptional()
  end: Date;

  @IsISO8601()
  @IsOptional()
  startDate: Date;

  @IsISO8601()
  @IsOptional()
  endDate: Date;

  @IsEnum(FLIGHT_SCHEDULE_STATUS)
  @IsOptional()
  status: FLIGHT_SCHEDULE_STATUS;

  @IsEnum(ROUTE_TYPE)
  @IsOptional()
  type: ROUTE_TYPE;
}

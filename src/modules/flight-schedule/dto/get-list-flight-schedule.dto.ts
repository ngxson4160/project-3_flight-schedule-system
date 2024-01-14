import { IsISO8601, IsOptional } from 'class-validator';

export class FGetListFlightScheduleDto {
  @IsOptional()
  userId?: number;

  @IsISO8601()
  @IsOptional()
  start: Date;

  @IsISO8601()
  @IsOptional()
  end: Date;
}

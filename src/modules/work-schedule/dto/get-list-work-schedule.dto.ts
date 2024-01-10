import { IsISO8601, IsOptional } from 'class-validator';

export class FGetListWorkScheduleDto {
  @IsOptional()
  userId?: number;

  @IsISO8601()
  @IsOptional()
  startDate: Date;

  @IsISO8601()
  @IsOptional()
  endDate: Date;
}

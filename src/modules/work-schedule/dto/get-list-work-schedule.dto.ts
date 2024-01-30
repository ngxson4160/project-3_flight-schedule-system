import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class FGetListWorkScheduleDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsISO8601()
  @IsOptional()
  startDate: Date;

  @IsISO8601()
  @IsOptional()
  endDate: Date;
}

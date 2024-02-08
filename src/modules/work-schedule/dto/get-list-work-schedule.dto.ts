import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

export class FGetListWorkScheduleDto {
  @IsOptional()
  userId?: string;

  @IsISO8601()
  @IsOptional()
  startDate: Date;

  @IsISO8601()
  @IsOptional()
  endDate: Date;
}

import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateFlightScheduleDto {
  @IsNumber()
  @IsOptional()
  helicopterId: number;

  @IsNumber()
  @IsOptional()
  routeId: number;

  @IsNumber()
  @IsOptional()
  pilotId: number;

  @IsNumber()
  @IsOptional()
  tourGuideId: number;

  @IsBoolean()
  @IsOptional()
  isAllowMatchOther?: boolean;

  @IsNumber()
  @IsOptional()
  capacity: number;

  @IsDateString()
  @IsOptional()
  start: Date;
}

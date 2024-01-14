import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateFlightScheduleDto {
  @IsNumber()
  helicopterId: number;

  @IsNumber()
  routeId: number;

  @IsNumber()
  pilotId: number;

  @IsNumber()
  tourGuideId: number;

  @IsBoolean()
  @IsOptional()
  isAllowMatchOther?: boolean;

  @IsNumber()
  capacity = 1;

  @IsDateString()
  start: Date;
}

import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestHireHelicopterDto {
  @IsNumber()
  routeId: number;

  @IsNumber()
  helicopterId: number;

  @IsNumber()
  @IsOptional()
  pilotId: number;

  @IsNumber()
  @IsOptional()
  tourGuideId: number;

  @IsDateString()
  start: Date;

  @IsDateString()
  end: Date;

  @IsString()
  purpose: string;

  @IsNumber()
  capacity: number;
}

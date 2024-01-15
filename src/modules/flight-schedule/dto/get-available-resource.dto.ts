import { IsDateString } from 'class-validator';

export class FGetAvailableResourceDto {
  @IsDateString()
  start: Date;

  @IsDateString()
  end: Date;
}

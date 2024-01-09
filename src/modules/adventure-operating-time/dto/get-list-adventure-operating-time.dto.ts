import { IsISO8601, IsOptional } from 'class-validator';

export class FGetListAdventureOperatingTimeDto {
  @IsISO8601()
  @IsOptional()
  startDate: Date;

  @IsISO8601()
  @IsOptional()
  endDate: Date;
}

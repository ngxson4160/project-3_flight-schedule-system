import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ResolveHireHelicopterDto {
  @IsBoolean()
  isAccept: boolean;

  @IsOptional()
  @IsDateString()
  start?: Date;

  @IsOptional()
  @IsDateString()
  end?: Date;

  @IsString()
  @IsOptional()
  reason: string;

  @IsNumber()
  @IsOptional()
  price: number;
}

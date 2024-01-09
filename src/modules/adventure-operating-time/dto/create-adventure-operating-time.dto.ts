import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { RegexConstant } from 'src/common/constants/regex.constant';

export class AdventureOperatingTimeDto {
  @IsNumber()
  routeId: number;

  @IsString()
  @Matches(RegexConstant.TimeReg_HH_MM, {
    message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  })
  @IsOptional()
  startMorning?: string;

  @IsString()
  @Matches(RegexConstant.TimeReg_HH_MM, {
    message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  })
  @IsOptional()
  endMorning?: string;

  @IsString()
  @Matches(RegexConstant.TimeReg_HH_MM, {
    message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  })
  @IsOptional()
  startAfternoon?: string;

  @IsString()
  @Matches(RegexConstant.TimeReg_HH_MM, {
    message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  })
  @IsOptional()
  endAfternoon?: string;

  // @Transform( ({ value }) => value && new Date(value))
  @IsISO8601()
  date: Date;
}

import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { RegexConstant } from 'src/common/constants/regex.constant';

export class CreateAdventureOperatingTimeDto {
  @IsNumber()
  routeId: number;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // startMorning?: string;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // endMorning?: string;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // startAfternoon?: string;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // endAfternoon?: string;

  @IsDateString()
  @IsOptional()
  startMorning?: Date;

  @IsDateString()
  @IsOptional()
  endMorning?: Date;

  @IsDateString()
  @IsOptional()
  startAfternoon?: Date;

  @IsDateString()
  @IsOptional()
  endAfternoon?: Date;

  @IsDateString()
  date: Date;
}

export class UpdateAdventureOperatingTimeDto {
  @IsNumber()
  @IsOptional()
  routeId: number;

  @IsDateString()
  @IsOptional()
  startMorning?: Date;

  @IsDateString()
  @IsOptional()
  endMorning?: Date;

  @IsDateString()
  @IsOptional()
  startAfternoon?: Date;

  @IsDateString()
  @IsOptional()
  endAfternoon?: Date;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // startMorning?: string;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // endMorning?: string;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // startAfternoon?: string;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // endAfternoon?: string;
}

import {
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  IsDateString,
} from 'class-validator';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { RegexConstant } from 'src/common/constants/regex.constant';

export class CreateWorkScheduleDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // startTime: string;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // endTime: string;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  // @Transform( ({ value }) => value && new Date(value))
  @IsDateString()
  date: Date;
}

export class UpdateWorkScheduleDto {
  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // startTime?: string;

  // @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  // @IsOptional()
  // endTime?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;
}

export class RequestUpdateWorkScheduleDto {
  @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  @IsOptional()
  startTime?: string;

  @IsString()
  // @Matches(RegexConstant.TimeReg_HH_MM, {
  //   message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  // })
  @IsOptional()
  endTime?: string;

  @IsOptional()
  reason?: string;
}

export class ResolveUpdateWorkScheduleDto {
  @IsBoolean()
  isAccept: boolean;

  @IsString()
  @Matches(RegexConstant.TimeReg_HH_MM, {
    message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  })
  @IsOptional()
  startTime?: string;

  @IsString()
  @Matches(RegexConstant.TimeReg_HH_MM, {
    message: MessageResponse.COMMON.INVALID_HOUR_MINUS_FORMAT,
  })
  @IsOptional()
  endTime?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { RegexConstant } from 'src/common/constants/regex.constant';

export class UpdateWorkScheduleDto {
  @IsNumber()
  @IsOptional()
  parentId?: number;

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

  // @Transform( ({ value }) => value && new Date(value))
  @IsISO8601()
  @IsOptional()
  date?: Date;
}

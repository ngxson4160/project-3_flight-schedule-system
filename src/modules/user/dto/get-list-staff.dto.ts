import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { RegexConstant } from 'src/common/constants/regex.constant';

export enum EStaff {
  TOUR_GUIDE = 'TOUR_GUIDE',
  PILOT = 'PILOT',
}
export class UpdateWorkScheduleDto {
  @IsEnum(() => EStaff)
  type: string;
}

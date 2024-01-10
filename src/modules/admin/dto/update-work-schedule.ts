import { IsBoolean } from 'class-validator';

export class ResolveRequestUpdateWorkScheduleDto {
  @IsBoolean()
  isAccept: boolean;
}

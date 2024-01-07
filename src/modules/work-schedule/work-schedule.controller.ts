import { Controller, Get } from '@nestjs/common';
import { WorkScheduleService } from './work-schedule.service';

@Controller('work-schedule')
export class WorkScheduleController {
  constructor(private readonly workScheduleService: WorkScheduleService) {}
}

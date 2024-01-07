import { Controller, Get } from '@nestjs/common';
import { UserFlightScheduleService } from './user-flight-schedule.service';

@Controller('user-flight-schedule')
export class UserFlightScheduleController {
  constructor(
    private readonly userFlightScheduleService: UserFlightScheduleService,
  ) {}
}

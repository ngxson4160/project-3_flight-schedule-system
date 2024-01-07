import { Controller, Get } from '@nestjs/common';
import { FlightScheduleService } from './flight-schedule.service';

@Controller('flight-schedule')
export class FlightScheduleController {
  constructor(private readonly flightScheduleService: FlightScheduleService) {}
}

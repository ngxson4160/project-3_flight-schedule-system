import { Body, Controller, Get, Post } from '@nestjs/common';
import { FlightScheduleService } from './flight-schedule.service';
import { UserData } from 'src/auth/decorator/user-info.decorator';
import { UserDataType } from 'src/common/types/user-data.type';
import { CreateFlightScheduleDto } from './dto/create-flight-schedule.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';

@Controller('flight-schedules')
export class FlightScheduleController {
  constructor(private readonly flightScheduleService: FlightScheduleService) {}

  @Role(ROLE.CUSTOMER, ROLE.ADMIN)
  @Post()
  async createFlightSchedule(
    @UserData() customerInfo: UserDataType,
    @Body() createFlightScheduleDto: CreateFlightScheduleDto,
  ) {
    return this.flightScheduleService.createAdventureFlightSchedule(
      customerInfo.id,
      createFlightScheduleDto,
    );
  }
}

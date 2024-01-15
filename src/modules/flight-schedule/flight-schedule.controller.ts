import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { FlightScheduleService } from './flight-schedule.service';
import { UserData } from 'src/auth/decorator/user-info.decorator';
import { UserDataType } from 'src/common/types/user-data.type';
import { CreateFlightScheduleDto } from './dto/create-flight-schedule.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';
import { FGetListFlightScheduleDto } from './dto/get-list-flight-schedule.dto';
import { userInfo } from 'os';
import { FGetAvailableResourceDto } from './dto/get-available-resource.dto';

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

  @Get()
  async getListFlightSchedule(
    @Body() getListFlightScheduleDto: FGetListFlightScheduleDto,
  ) {
    return this.flightScheduleService.getListFlightSchedule(
      getListFlightScheduleDto,
    );
  }

  @Role(ROLE.CUSTOMER, ROLE.ADMIN)
  @Put(':id/cancel')
  async cancelFlightSchedule(
    @Param('id') id: string,
    @UserData() userInfo: UserDataType,
  ) {
    return this.flightScheduleService.cancelFlightSchedule(+id, userInfo);
  }

  @Get('get-list-resources-available')
  async getListResourcesAvailable(@Body() filter: FGetAvailableResourceDto) {
    return this.flightScheduleService.getListResourcesAvailable(filter);
  }
}

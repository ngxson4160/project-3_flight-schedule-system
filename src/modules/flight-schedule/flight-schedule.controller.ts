import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FlightScheduleService } from './flight-schedule.service';
import { UserData } from 'src/auth/decorator/user-info.decorator';
import { UserDataType } from 'src/common/types/user-data.type';
import { CreateFlightScheduleDto } from './dto/create-flight-schedule.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';
import { FGetListFlightScheduleDto } from './dto/get-list-flight-schedule.dto';
import { userInfo } from 'os';
import { FGetAvailableResourceDto } from './dto/get-available-resource.dto';
import { RequestHireHelicopterDto } from './dto/request-hire-helicopter.dto';
import { ResolveHireHelicopterDto } from './dto/resolve-hire-helicopter.dto';

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
    @Query() getListFlightScheduleDto: FGetListFlightScheduleDto,
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
  async getListResourcesAvailable(@Query() filter: FGetAvailableResourceDto) {
    return this.flightScheduleService.getListResourcesAvailable(filter);
  }

  @Role(ROLE.CUSTOMER)
  @Post('request-hire-helicopter')
  async requestHireHelicopter(
    @UserData() customerInfo: UserDataType,
    @Body() requestHireDto: RequestHireHelicopterDto,
  ) {
    return this.flightScheduleService.requestHireHelicopter(
      customerInfo.id,
      requestHireDto,
    );
  }

  @Role(ROLE.ADMIN)
  @Post(':id/resolve-hire-helicopter')
  async resolveHireHelicopter(
    @Param('id') id: string,
    @UserData() adminInfo: UserDataType,
    @Body() resolveHireHelicopter: ResolveHireHelicopterDto,
  ) {
    return this.flightScheduleService.resolveHireHelicopter(
      +id,
      adminInfo,
      resolveHireHelicopter,
    );
  }

  // @Role(ROLE.ADMIN, ROLE.CUSTOMER)
  // @Post(':id/resolve-hire-helicopter')
  // async updateAdventureFlightSchedule(
  //   @Param('id') id: string,
  //   @UserData() adminInfo: UserDataType,
  //   @Body() resolveHireHelicopter: ResolveHireHelicopterDto,
  // ) {
  //   return this.flightScheduleService.updateAdventureFlightSchedule(
  //     +id,
  //     adminInfo,
  //     resolveHireHelicopter,
  //   );
  // }
}

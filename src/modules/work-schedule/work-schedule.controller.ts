import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WorkScheduleService } from './work-schedule.service';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';
import {
  CreateWorkScheduleDto,
  RequestUpdateWorkScheduleDto,
  ResolveUpdateWorkScheduleDto,
  UpdateWorkScheduleDto,
} from './dto/create-work-schedule.dto';
import { FGetListWorkScheduleDto } from './dto/get-list-work-schedule.dto';
import { UserDataType } from 'src/common/types/user-data.type';
import { UserData } from 'src/auth/decorator/user-info.decorator';

@Controller('work-schedules')
export class WorkScheduleController {
  constructor(private readonly workScheduleService: WorkScheduleService) {}

  @Post()
  @Role(ROLE.ADMIN)
  async createHelicopter(
    @Body()
    createWorkSchedule: CreateWorkScheduleDto,
  ) {
    return this.workScheduleService.createWorkSchedule(createWorkSchedule);
  }

  @Put('/:id')
  @Role(ROLE.ADMIN)
  async updateWorkSchedule(
    @Body() updateWorkScheduleDto: UpdateWorkScheduleDto,
    @Param('id') id: string,
  ) {
    return this.workScheduleService.updateWorkSchedule(
      +id,
      updateWorkScheduleDto,
    );
  }

  @Get()
  async getListWorkSchedule(@Body() getWorkSchedule: FGetListWorkScheduleDto) {
    return this.workScheduleService.getListWorkSchedule(getWorkSchedule);
  }

  @Delete(':id')
  @Role(ROLE.ADMIN)
  async deleteHelicopter(@Param('id') id: string) {
    return this.workScheduleService.deleteWorkSchedule(+id);
  }

  @Get(':id')
  @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE)
  async getWorkSchedule(@Param('id') workScheduleId: string) {
    return this.workScheduleService.getDetailWorkSchedule(+workScheduleId);
  }

  @Put('/request-change/:id')
  @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE)
  async requestUpdateWorkSchedule(
    @UserData() userInfo: UserDataType,
    @Param('id') workScheduleId: string,
    @Body() updateWorkSchedule: RequestUpdateWorkScheduleDto,
  ) {
    return this.workScheduleService.requestUpdateWorkSchedule(
      userInfo.id,
      +workScheduleId,
      updateWorkSchedule,
    );
  }

  @Post('/resolve-change/:id')
  @Role(ROLE.ADMIN)
  async resolveUpdateWorkSchedule(
    @Param('id') id: string,
    @UserData() userInfo: UserDataType,
    @Body() resolveUpdateWorkSchedule: ResolveUpdateWorkScheduleDto,
  ) {
    return this.workScheduleService.resolveUpdateWorkSchedule(
      +id,
      userInfo.id,
      resolveUpdateWorkSchedule,
    );
  }
}

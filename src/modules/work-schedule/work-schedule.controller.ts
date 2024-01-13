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
  UpdateWorkScheduleDto,
} from './dto/create-work-schedule.dto';
import { FGetListWorkScheduleDto } from './dto/get-list-work-schedule.dto';

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

  @Delete('/:id')
  @Role(ROLE.ADMIN)
  async deleteHelicopter(@Param('id') id: string) {
    return this.workScheduleService.deleteWorkSchedule(+id);
  }
}

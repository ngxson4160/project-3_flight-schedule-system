import { BadRequestException, Body, Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { FGetListWorkScheduleDto } from '../work-schedule/dto/get-list-work-schedule.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveUpdateWorkSchedule(workScheduleId: number, isAccept: boolean) {
    const workScheduleFound = await this.prisma.workSchedule.findUnique({
      where: { id: workScheduleId },
    });
    if (!workScheduleFound) {
      throw new BadRequestException(MessageResponse.WORK_SCHEDULE.NOT_EXIST);
    }

    const workScheduleChildFound = await this.prisma.workSchedule.findFirst({
      where: { parentId: workScheduleId },
    });
    if (!workScheduleChildFound) {
      throw new BadRequestException(
        MessageResponse.WORK_SCHEDULE.REQUEST_UPDATE_NOT_EXIST,
      );
    }

    // const workScheduleUpdate = await this.prisma.workSchedule.update({
    //   where: { id: workScheduleId },
    //   data: { isDelete: +isAccept },
    // });

    if (isAccept) {
      await this.prisma.workSchedule.update({
        where: { id: workScheduleId },
        data: { isDelete: 1 },
      });
    } else {
      await this.prisma.workSchedule.update({
        where: { id: workScheduleFound.parentId },
        data: { isDelete: 1 },
      });
    }

    return {
      message: MessageResponse.WORK_SCHEDULE.CREATE_SUCCESS,
    };
  }
}

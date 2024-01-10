import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateWorkScheduleDto,
  UpdateWorkScheduleDto,
} from './dto/create-work-schedule.dto';
import { FGetListWorkScheduleDto } from './dto/get-list-work-schedule.dto';

@Injectable()
export class WorkScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkSchedule(workSchedule: CreateWorkScheduleDto) {
    checkValidTime(workSchedule.startTime, workSchedule.endTime);

    const userFound = await this.prisma.user.findUnique({
      where: { id: workSchedule.userId },
    });

    if (!userFound) {
      throw new BadRequestException(MessageResponse.USER.NOT_EXIST);
    }

    const newWorkSchedule = await this.prisma.workSchedule.create({
      data: {
        ...workSchedule,
        date: new Date(workSchedule.date),
      },
    });
    return {
      message: MessageResponse.WORK_SCHEDULE.CREATE_SUCCESS,
      data: newWorkSchedule,
    };
  }

  async updateWorkSchedule(
    id: number,
    updateWorkSchedule: UpdateWorkScheduleDto,
  ) {
    if (
      (updateWorkSchedule!.startTime && !updateWorkSchedule!.endTime) ||
      (!updateWorkSchedule!.startTime && updateWorkSchedule!.endTime)
    ) {
      throw new BadRequestException(MessageResponse.WORK_SCHEDULE.ERROR_DATE);
    }

    if (updateWorkSchedule!.startTime) {
      checkValidTime(
        updateWorkSchedule!.startTime,
        updateWorkSchedule!.endTime,
      );
    }

    const workScheduleFound = await this.prisma.workSchedule.findUnique({
      where: { id },
    });

    if (!workScheduleFound) {
      throw new BadRequestException(MessageResponse.WORK_SCHEDULE.NOT_EXIST);
    }

    let dataUpdate = {};
    if (updateWorkSchedule?.date) {
      dataUpdate = {
        ...updateWorkSchedule,
        date: new Date(updateWorkSchedule?.date),
      };
    } else {
      dataUpdate = updateWorkSchedule;
    }

    const workScheduleUpdate = await this.prisma.workSchedule.update({
      where: {
        id,
      },
      data: dataUpdate,
    });
    return {
      message: MessageResponse.WORK_SCHEDULE.UPDATE_SUCCESS,
      data: workScheduleUpdate,
    };
  }

  async getListWorkSchedule(filter: FGetListWorkScheduleDto) {
    // const listadventureOperatingTimeFound = await this.prisma.adventureOperatingTime.findMany({
    //   skip: (filter.page - 1) * filter.perPage,
    //   take: filter.perPage,
    //   orderBy: {
    //     capacity: 'asc',
    //   },
    // });

    let whereQuery = {};
    if (filter.startDate) {
      whereQuery = { ...whereQuery, date: { gte: new Date(filter.startDate) } };
    }
    if (filter.endDate) {
      whereQuery = { ...whereQuery, date: { lte: new Date(filter.endDate) } };
    }
    if (filter.startDate && filter.endDate) {
      whereQuery = {
        ...whereQuery,
        date: {
          gte: new Date(filter.startDate),
          lte: new Date(filter.endDate),
        },
      };
    }
    if (filter.userId) {
      whereQuery = { userId: filter.userId, ...whereQuery };
    }

    const listWorkScheduleFound = await this.prisma.workSchedule.findMany({
      where: whereQuery,
    });

    return {
      message: MessageResponse.WORK_SCHEDULE.GET_LIST_SUCCESS,
      data: listWorkScheduleFound,
    };
  }

  async deleteWorkSchedule(id: number) {
    const workScheduleFound = await this.prisma.workSchedule.findUnique({
      where: { id },
    });

    if (!workScheduleFound) {
      throw new BadRequestException(MessageResponse.WORK_SCHEDULE.NOT_EXIST);
    }

    const deleteWorkSchedule = await this.prisma.workSchedule.delete({
      where: {
        id,
      },
    });

    return {
      message: MessageResponse.WORK_SCHEDULE.DELETE_SUCCESS,
      data: deleteWorkSchedule,
    };
  }
}

const checkValidTime = (startTime: string, endTime: string) => {
  const hourStart = startTime.slice(0, 2);
  const minusStart = startTime.slice(3, 5);

  const hourEnd = endTime.slice(0, 2);
  const minusEnd = endTime.slice(3, 5);

  if (hourStart > hourEnd || (hourStart == hourEnd && minusStart >= minusEnd)) {
    throw new BadRequestException(
      MessageResponse.COMMON.INVALID_TIME_START_AND_END,
    );
  }
};

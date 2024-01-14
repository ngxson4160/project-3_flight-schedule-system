import { BadRequestException, Body, Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { FGetListWorkScheduleDto } from '../work-schedule/dto/get-list-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule';
import { WORK_SCHEDULE_STATUS } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getListWorkScheduleByUserId(
    userId: number,
    filter: FGetListWorkScheduleDto,
  ) {
    // const listadventureOperatingTimeFound = await this.prisma.adventureOperatingTime.findMany({
    //   skip: (filter.page - 1) * filter.perPage,
    //   take: filter.perPage,
    //   orderBy: {
    //     capacity: 'asc',
    //   },
    // });

    const userFound = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userFound) {
      throw new BadRequestException(MessageResponse.USER.NOT_EXIST);
    }

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

    const listWorkScheduleFound = await this.prisma.workSchedule.findMany({
      where: { userId, ...whereQuery },
    });

    return {
      message: MessageResponse.WORK_SCHEDULE.GET_LIST_SUCCESS,
      data: listWorkScheduleFound,
    };
  }

  // async requestUpdateWorkSchedule(
  //   userId: number,
  //   workScheduleId: number,
  //   updateWorkSchedule: UpdateWorkScheduleDto,
  // ) {
  //   const userFound = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!userFound) {
  //     throw new BadRequestException(MessageResponse.USER.NOT_EXIST);
  //   }
  //   const workScheduleFound = await this.prisma.workSchedule.findFirst({
  //     where: { id: workScheduleId, userId },
  //   });

  //   if (!workScheduleFound) {
  //     throw new BadRequestException(
  //       MessageResponse.WORK_SCHEDULE.NOT_EXIST_WITH_USER(
  //         workScheduleId,
  //         userId,
  //       ),
  //     );
  //   }

  //   if (updateWorkSchedule?.date) {
  //     updateWorkSchedule.date = new Date(updateWorkSchedule.date);
  //   }

  //   const workScheduleChildFound = await this.prisma.workSchedule.findFirst({
  //     where: { parentId: workScheduleId },
  //   });

  //   if (updateWorkSchedule.reason) {
  //     const noteRequestChangeFound =
  //       await this.prisma.noteRequestChangeWorkSchedule.findFirst({
  //         where: { workScheduleId: workScheduleChildFound.id, userId },
  //       });
  //     if (noteRequestChangeFound) {
  //       await this.prisma.noteRequestChangeWorkSchedule.update({
  //         where: { id: noteRequestChangeFound.id },
  //         data: { message: updateWorkSchedule.reason },
  //       });
  //     } else {
  //       await this.prisma.noteRequestChangeWorkSchedule.create({
  //         data: {
  //           userId,
  //           workScheduleId: workScheduleChildFound.id,
  //           message: updateWorkSchedule.reason,
  //         },
  //       });
  //     }
  //     delete updateWorkSchedule.reason;
  //   }

  //   if (workScheduleChildFound) {
  //     const updateWorkScheduleChild = await this.prisma.workSchedule.update({
  //       where: { id: workScheduleChildFound.id },
  //       data: updateWorkSchedule,
  //     });
  //     return {
  //       message: MessageResponse.WORK_SCHEDULE.REQUEST_UPDATE_SUCCESS,
  //       data: updateWorkScheduleChild,
  //     };
  //   }

  //   const parentId = workScheduleFound.id;
  //   delete workScheduleFound.id;
  //   delete workScheduleFound.createAt;
  //   delete workScheduleFound.updateAt;
  //   const createWorkScheduleChild = {
  //     ...workScheduleFound,
  //     ...updateWorkSchedule,
  //     parentId,
  //   };

  //   const newWorkScheduleChild = await this.prisma.workSchedule.create({
  //     data: {
  //       ...createWorkScheduleChild,
  //       status: WORK_SCHEDULE_STATUS.PENDING_UPDATE,
  //     },
  //   });

  //   if (updateWorkSchedule.reason) {
  //     await this.prisma.noteRequestChangeWorkSchedule.create({
  //       data: {
  //         userId,
  //         workScheduleId: newWorkScheduleChild.id,
  //         message: updateWorkSchedule.reason,
  //       },
  //     });
  //   }

  //   return {
  //     message: MessageResponse.WORK_SCHEDULE.REQUEST_UPDATE_SUCCESS,
  //     data: newWorkScheduleChild,
  //   };
  // }

  // async getWorkSchedule(workScheduleId: number) {
  //   const workScheduleFound = await this.prisma.workSchedule.findFirst({
  //     where: { id: workScheduleId, status: WORK_SCHEDULE_STATUS.APPLY },
  //   });

  //   if (!workScheduleFound) {
  //     throw new BadRequestException(MessageResponse.WORK_SCHEDULE.NOT_EXIST);
  //   }

  //   const workScheduleChildFound = await this.prisma.workSchedule.findFirst({
  //     where: { parentId: workScheduleId },
  //   });

  //   let noteRequestChangeFound;

  //   if (workScheduleChildFound) {
  //     noteRequestChangeFound =
  //       await this.prisma.noteRequestChangeWorkSchedule.findFirst({
  //         where: { workScheduleId: workScheduleChildFound.id },
  //       });
  //   }

  //   return {
  //     message: MessageResponse.WORK_SCHEDULE.GET_DETAIL_SUCCESS,
  //     data: {
  //       workSchedule: workScheduleFound,
  //       workScheduleUpdate: {
  //         ...workScheduleChildFound,
  //         reasonUpdate: noteRequestChangeFound?.message,
  //       },
  //     },
  //   };
  // }
}

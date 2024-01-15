import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateWorkScheduleDto,
  RequestUpdateWorkScheduleDto,
  ResolveUpdateWorkScheduleDto,
  UpdateWorkScheduleDto,
} from './dto/create-work-schedule.dto';
import { FGetListWorkScheduleDto } from './dto/get-list-work-schedule.dto';
import { ROLE, WORK_SCHEDULE_STATUS } from '@prisma/client';
import { UserDataType } from 'src/common/types/user-data.type';
import { checkSameDay, getDateWithoutTime } from 'src/utils/function.utils';

@Injectable()
export class WorkScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkSchedule(workSchedule: CreateWorkScheduleDto) {
    const dateWithoutTime = getDateWithoutTime(workSchedule.date);

    if (workSchedule.startTime >= workSchedule.endTime) {
      throw new BadRequestException(
        MessageResponse.COMMON.INVALID_TIME_START_AND_END,
      );
    }

    if (
      !checkSameDay(workSchedule.startTime, workSchedule.endTime) ||
      !checkSameDay(workSchedule.startTime, dateWithoutTime)
    ) {
      throw new BadRequestException(
        MessageResponse.COMMON.INVALID_TIME_START_AND_END,
      );
    }

    const userFound = await this.prisma.user.findUnique({
      where: { id: workSchedule.userId },
    });

    if (!userFound) {
      throw new BadRequestException(MessageResponse.USER.NOT_EXIST);
    }

    const workScheduleFound = await this.prisma.workSchedule.findFirst({
      where: { date: dateWithoutTime },
    });

    if (workScheduleFound) {
      throw new BadRequestException(MessageResponse.WORK_SCHEDULE.EXIST);
    }

    const newWorkSchedule = await this.prisma.workSchedule.create({
      data: {
        ...workSchedule,
        date: dateWithoutTime,
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
      updateWorkSchedule!.startTime &&
      updateWorkSchedule!.endTime &&
      updateWorkSchedule!.startTime >= updateWorkSchedule!.endTime
    ) {
      throw new BadRequestException(
        MessageResponse.COMMON.INVALID_TIME_START_AND_END,
      );
    }

    if (
      !checkSameDay(updateWorkSchedule.startTime, updateWorkSchedule.endTime) ||
      !checkSameDay(updateWorkSchedule.startTime, updateWorkSchedule.date)
    ) {
      throw new BadRequestException(
        MessageResponse.COMMON.INVALID_TIME_START_AND_END,
      );
    }

    const workScheduleFound = await this.prisma.workSchedule.findFirst({
      where: { id, date: updateWorkSchedule.date },
    });

    if (!workScheduleFound) {
      throw new BadRequestException(MessageResponse.WORK_SCHEDULE.NOT_EXIST);
    }

    if (
      updateWorkSchedule!.startTime &&
      !updateWorkSchedule!.endTime &&
      !checkSameDay(updateWorkSchedule.startTime, workScheduleFound.endTime)
    ) {
      throw new BadRequestException(
        MessageResponse.COMMON.INVALID_TIME_START_AND_END,
      );
    }

    if (
      !updateWorkSchedule!.startTime &&
      updateWorkSchedule!.endTime &&
      !checkSameDay(workScheduleFound.startTime, workScheduleFound.endTime)
    ) {
      throw new BadRequestException(
        MessageResponse.COMMON.INVALID_TIME_START_AND_END,
      );
    }

    const workScheduleUpdate = await this.prisma.workSchedule.update({
      where: {
        id,
      },
      data: updateWorkSchedule,
    });
    return {
      message: MessageResponse.WORK_SCHEDULE.UPDATE_SUCCESS,
      data: workScheduleUpdate,
    };
  }

  async getListWorkSchedule(filter: FGetListWorkScheduleDto) {
    // const listAdventureOperatingTimeFound = await this.prisma.adventureOperatingTime.findMany({
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

  async getDetailWorkSchedule(workScheduleId: number) {
    const workScheduleFound = await this.prisma.workSchedule.findFirst({
      where: {
        id: workScheduleId,
        OR: [
          { status: WORK_SCHEDULE_STATUS.APPLY },
          { status: WORK_SCHEDULE_STATUS.ORIGINAL },
        ],
      },
    });

    if (!workScheduleFound) {
      throw new BadRequestException(MessageResponse.WORK_SCHEDULE.NOT_EXIST);
    }

    const workScheduleChildFound = await this.prisma.workSchedule.findFirst({
      where: { parentId: workScheduleId },
    });

    const noteRequestChangeFound: {
      reasonUpdate?: string;
      resolveMessage?: string;
    } = {};

    if (workScheduleChildFound) {
      const noteRequestChangeStaffFound =
        await this.prisma.noteRequestChangeWorkSchedule.findFirst({
          where: {
            workScheduleId: workScheduleChildFound.id,
            NOT: [{ role: ROLE.ADMIN }],
          },
        });

      const noteRequestChangeAdminFound =
        await this.prisma.noteRequestChangeWorkSchedule.findFirst({
          where: {
            workScheduleId: workScheduleChildFound.id,
            role: ROLE.ADMIN,
          },
        });
      noteRequestChangeFound.reasonUpdate =
        noteRequestChangeStaffFound?.message;
      noteRequestChangeFound.resolveMessage =
        noteRequestChangeAdminFound?.message;
    }

    return {
      message: MessageResponse.WORK_SCHEDULE.GET_DETAIL_SUCCESS,
      data: {
        workSchedule: workScheduleFound,
        workScheduleUpdate: {
          ...workScheduleChildFound,
          message: {
            reasonUpdate: noteRequestChangeFound.reasonUpdate,
            resolveMessage: noteRequestChangeFound.resolveMessage,
          },
        },
      },
    };
  }

  async requestUpdateWorkSchedule(
    userInfo: UserDataType,
    workScheduleId: number,
    updateWorkSchedule: RequestUpdateWorkScheduleDto,
  ) {
    const userFound = await this.prisma.user.findUnique({
      where: { id: userInfo.id },
    });

    if (!userFound) {
      throw new BadRequestException(MessageResponse.USER.NOT_EXIST);
    }
    const workScheduleFound = await this.prisma.workSchedule.findFirst({
      where: {
        id: workScheduleId,
        userId: userInfo.id,
        OR: [
          { status: WORK_SCHEDULE_STATUS.APPLY },
          { status: WORK_SCHEDULE_STATUS.ORIGINAL },
        ],
      },
    });

    if (!workScheduleFound) {
      throw new BadRequestException(
        MessageResponse.WORK_SCHEDULE.NOT_EXIST_WITH_USER(
          workScheduleId,
          userInfo.id,
        ),
      );
    }

    const validDateUpdate = workScheduleFound.date;
    validDateUpdate.setDate(validDateUpdate.getDate() - 1);
    if (new Date() > validDateUpdate) {
      throw new BadRequestException(
        MessageResponse.WORK_SCHEDULE.EXPIRED_DATE_REQUEST_UPDATE,
      );
    }

    const workScheduleChildFound = await this.prisma.workSchedule.findFirst({
      where: { parentId: workScheduleId },
    });

    let workScheduleChildUpdate;

    if (workScheduleChildFound) {
      if (updateWorkSchedule.reason) {
        const noteRequestChangeFound =
          await this.prisma.noteRequestChangeWorkSchedule.findFirst({
            where: {
              workScheduleId: workScheduleChildFound.id,
              userId: userInfo.id,
            },
          });
        if (noteRequestChangeFound) {
          await this.prisma.noteRequestChangeWorkSchedule.update({
            where: { id: noteRequestChangeFound.id },
            data: { message: updateWorkSchedule.reason },
          });
        } else {
          await this.prisma.noteRequestChangeWorkSchedule.create({
            data: {
              userId: userInfo.id,
              workScheduleId: workScheduleChildFound.id,
              message: updateWorkSchedule.reason,
              role: userInfo.role,
            },
          });
        }
        delete updateWorkSchedule.reason;
      }
      workScheduleChildUpdate = await this.prisma.workSchedule.update({
        where: { id: workScheduleChildFound.id },
        data: updateWorkSchedule,
      });
    } else {
      const parentId = workScheduleFound.id;
      const reason = updateWorkSchedule.reason;
      delete updateWorkSchedule.reason;
      delete workScheduleFound.id;
      delete workScheduleFound.createAt;
      delete workScheduleFound.updateAt;
      const createWorkScheduleChild = {
        ...workScheduleFound,
        ...updateWorkSchedule,
        parentId,
      };

      workScheduleChildUpdate = await this.prisma.workSchedule.create({
        data: {
          ...createWorkScheduleChild,
          status: WORK_SCHEDULE_STATUS.PENDING_UPDATE,
        },
      });

      if (reason) {
        await this.prisma.noteRequestChangeWorkSchedule.create({
          data: {
            userId: userInfo.id,
            workScheduleId: workScheduleChildUpdate.id,
            message: reason,
            role: userInfo.role,
          },
        });
      }
    }

    return {
      message: MessageResponse.WORK_SCHEDULE.REQUEST_UPDATE_SUCCESS,
      data: workScheduleChildUpdate,
    };
  }

  async resolveUpdateWorkSchedule(
    id: number,
    userInfo: UserDataType,
    resolveUpdateWorkSchedule: ResolveUpdateWorkScheduleDto,
  ) {
    const workScheduleFound = await this.prisma.workSchedule.findFirst({
      where: {
        id,
        OR: [
          { status: WORK_SCHEDULE_STATUS.APPLY },
          { status: WORK_SCHEDULE_STATUS.ORIGINAL },
        ],
      },
    });
    if (!workScheduleFound) {
      throw new BadRequestException(MessageResponse.WORK_SCHEDULE.NOT_EXIST);
    }

    const workScheduleChildFound = await this.prisma.workSchedule.findFirst({
      where: { parentId: id },
    });
    if (!workScheduleChildFound) {
      throw new BadRequestException(
        MessageResponse.WORK_SCHEDULE.REQUEST_UPDATE_NOT_EXIST,
      );
    }

    if (resolveUpdateWorkSchedule?.reason) {
      const noteRequestChangeFound =
        await this.prisma.noteRequestChangeWorkSchedule.findFirst({
          where: {
            workScheduleId: workScheduleChildFound.id,
            userId: userInfo.id,
          },
        });
      if (noteRequestChangeFound) {
        await this.prisma.noteRequestChangeWorkSchedule.update({
          where: { id: noteRequestChangeFound.id },
          data: { message: resolveUpdateWorkSchedule.reason },
        });
      } else {
        await this.prisma.noteRequestChangeWorkSchedule.create({
          data: {
            userId: userInfo.id,
            workScheduleId: workScheduleChildFound.id,
            message: resolveUpdateWorkSchedule.reason,
            role: userInfo.role,
          },
        });
      }
    }

    if (resolveUpdateWorkSchedule.isAccept) {
      await this.prisma.workSchedule.update({
        where: { id: workScheduleChildFound.id },
        data: { status: WORK_SCHEDULE_STATUS.APPLY },
      });
      await this.prisma.workSchedule.update({
        where: { id },
        data: { status: WORK_SCHEDULE_STATUS.ORIGINAL },
      });
    } else {
      await this.prisma.workSchedule.update({
        where: { id: workScheduleChildFound.id },
        data: { status: WORK_SCHEDULE_STATUS.REJECT_UPDATE },
      });
      await this.prisma.workSchedule.update({
        where: { id },
        data: { status: WORK_SCHEDULE_STATUS.APPLY },
      });
    }

    return {
      message: MessageResponse.WORK_SCHEDULE.Resolve_UPDATE_SUCCESS,
    };
  }
}

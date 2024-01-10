import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAdventureOperatingTimeDto,
  UpdateAdventureOperatingTimeDto,
} from './dto/create-adventure-operating-time.dto';
import { FGetListAdventureOperatingTimeDto } from './dto/get-list-adventure-operating-time.dto';

@Injectable()
export class AdventureOperatingTimeService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdventureOperatingTime(
    adventureOperatingTime: CreateAdventureOperatingTimeDto,
  ) {
    if (
      (adventureOperatingTime!.startMorning &&
        !adventureOperatingTime!.endMorning) ||
      (!adventureOperatingTime!.startMorning &&
        adventureOperatingTime!.endMorning)
    ) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.ERROR_DATE,
      );
    }
    if (
      (adventureOperatingTime!.startAfternoon &&
        !adventureOperatingTime!.endAfternoon) ||
      (!adventureOperatingTime!.startAfternoon &&
        adventureOperatingTime!.endAfternoon)
    ) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.ERROR_DATE,
      );
    }

    if (adventureOperatingTime!.startMorning) {
      checkValidTime(
        adventureOperatingTime!.startMorning,
        adventureOperatingTime!.endMorning,
      );
    }

    if (adventureOperatingTime!.startAfternoon) {
      checkValidTime(
        adventureOperatingTime!.startAfternoon,
        adventureOperatingTime!.endAfternoon,
      );
    }

    const routeFound = await this.prisma.route.findUnique({
      where: { id: adventureOperatingTime.routeId },
    });

    if (!routeFound) {
      throw new BadRequestException(MessageResponse.ROUTE.NOT_EXIST);
    }

    const newAdventureOperatingTime =
      await this.prisma.adventureOperatingTime.create({
        data: {
          ...adventureOperatingTime,
          date: new Date(adventureOperatingTime.date),
        },
      });
    return {
      message: MessageResponse.ADVENTURE_OPERATING_TIME.CREATE_SUCCESS,
      data: newAdventureOperatingTime,
    };
  }

  async updateAdventureOperatingTime(
    id: number,
    adventureOperatingTime: UpdateAdventureOperatingTimeDto,
  ) {
    if (
      (adventureOperatingTime!.startMorning &&
        !adventureOperatingTime!.endMorning) ||
      (!adventureOperatingTime!.startMorning &&
        adventureOperatingTime!.endMorning)
    ) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.ERROR_DATE,
      );
    }
    if (
      (adventureOperatingTime!.startAfternoon &&
        !adventureOperatingTime!.endAfternoon) ||
      (!adventureOperatingTime!.startAfternoon &&
        adventureOperatingTime!.endAfternoon)
    ) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.ERROR_DATE,
      );
    }

    if (adventureOperatingTime!.startMorning) {
      checkValidTime(
        adventureOperatingTime!.startMorning,
        adventureOperatingTime!.endMorning,
      );
    }

    if (adventureOperatingTime!.startAfternoon) {
      checkValidTime(
        adventureOperatingTime!.startAfternoon,
        adventureOperatingTime!.endAfternoon,
      );
    }

    const adventureOperatingTimeFound =
      await this.prisma.adventureOperatingTime.findUnique({
        where: { id },
      });

    if (!adventureOperatingTimeFound) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.NOT_EXIST,
      );
    }

    let dataUpdate = {};
    if (adventureOperatingTime?.date) {
      dataUpdate = {
        ...adventureOperatingTime,
        date: new Date(adventureOperatingTime?.date),
      };
    } else {
      dataUpdate = adventureOperatingTime;
    }

    const adventureOperatingTimeUpdate =
      await this.prisma.adventureOperatingTime.update({
        where: {
          id,
        },
        data: dataUpdate,
      });
    return {
      message: MessageResponse.ADVENTURE_OPERATING_TIME.UPDATE_SUCCESS,
      data: adventureOperatingTimeUpdate,
    };
  }

  async getListAdventureOperatingTime(
    filter: FGetListAdventureOperatingTimeDto,
  ) {
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

    const listAdventureOperatingTimeFound =
      await this.prisma.adventureOperatingTime.findMany({ where: whereQuery });

    return {
      message: MessageResponse.ADVENTURE_OPERATING_TIME.GET_LIST_SUCCESS,
      data: listAdventureOperatingTimeFound,
    };
  }

  async deleteAdventureOperatingTime(id: number) {
    const adventureOperatingTimeFound =
      await this.prisma.adventureOperatingTime.findUnique({
        where: { id },
      });

    if (!adventureOperatingTimeFound) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.NOT_EXIST,
      );
    }

    const deleteAdventureOperatingTime =
      await this.prisma.adventureOperatingTime.delete({
        where: {
          id,
        },
      });

    return {
      message: MessageResponse.ADVENTURE_OPERATING_TIME.DELETE_SUCCESS,
      data: deleteAdventureOperatingTime,
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

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFlightScheduleDto } from './dto/create-flight-schedule.dto';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import {
  FLIGHT_SCHEDULE_STATUS,
  ROLE,
  ROUTE_TYPE,
  WORK_SCHEDULE_STATUS,
} from '@prisma/client';
import { FGetListFlightScheduleDto } from './dto/get-list-flight-schedule.dto';
import { getDateWithoutTime } from 'src/utils/function.utils';

@Injectable()
export class FlightScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdventureFlightSchedule(
    customerId: number,
    createFlightScheduleDto: CreateFlightScheduleDto,
  ) {
    const dateBooking = getDateWithoutTime(createFlightScheduleDto.start);

    const customerFound = await this.prisma.user.findUnique({
      where: { id: customerId, role: ROLE.CUSTOMER },
    });
    if (!customerFound) {
      throw new BadRequestException(MessageResponse.USER.CUSTOMER_NOT_EXIST);
    }

    const pilotFound = await this.prisma.user.findUnique({
      where: { id: createFlightScheduleDto.pilotId, role: ROLE.PILOT },
    });
    if (!pilotFound) {
      throw new BadRequestException(MessageResponse.USER.PILOT_NOT_EXIST);
    }

    const tourGuideFound = await this.prisma.user.findUnique({
      where: { id: createFlightScheduleDto.tourGuideId, role: ROLE.TOUR_GUIDE },
    });
    if (!tourGuideFound) {
      throw new BadRequestException(MessageResponse.USER.TOUR_GUIDE_NOT_EXIST);
    }

    const routeFound = await this.prisma.route.findUnique({
      where: { id: createFlightScheduleDto.routeId },
    });
    if (!routeFound) {
      throw new BadRequestException(MessageResponse.ROUTE.NOT_EXIST);
    }

    const helicopterFound = await this.prisma.helicopter.findUnique({
      where: { id: createFlightScheduleDto.helicopterId },
    });
    if (!helicopterFound) {
      throw new BadRequestException(MessageResponse.HELICOPTER.NOT_EXIST);
    }

    const endTime = new Date(createFlightScheduleDto.start);
    endTime.setMinutes(endTime.getMinutes() + routeFound.duration / 60);

    const adventureOperatingTimeFound =
      await this.prisma.adventureOperatingTime.findFirst({
        where: { date: dateBooking },
      });

    if (!adventureOperatingTimeFound) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.NOT_EXIST,
      );
    }

    if (
      (new Date(createFlightScheduleDto.start) <
        adventureOperatingTimeFound.startMorning ||
        endTime > adventureOperatingTimeFound.endMorning) &&
      (new Date(createFlightScheduleDto.start) <
        adventureOperatingTimeFound.startAfternoon ||
        endTime > adventureOperatingTimeFound.endAfternoon)
    ) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.OUTSIDE_OF_OPERATING_HOURS,
      );
    }

    const pilotWorkScheduleFound = await this.prisma.workSchedule.findFirst({
      where: {
        userId: createFlightScheduleDto.pilotId,
        date: dateBooking,
        startTime: { lte: createFlightScheduleDto.start },
        endTime: { gte: endTime },
        status: WORK_SCHEDULE_STATUS.APPLY,
      },
    });
    if (!pilotWorkScheduleFound) {
      throw new BadRequestException(
        MessageResponse.WORK_SCHEDULE.PILOT_OUTSIDE_OF_OPERATING_HOURS,
      );
    }

    const tourGuideWorkScheduleFound = await this.prisma.workSchedule.findFirst(
      {
        where: {
          userId: createFlightScheduleDto.tourGuideId,
          date: dateBooking,
          startTime: { lte: createFlightScheduleDto.start },
          endTime: { gte: endTime },
          status: WORK_SCHEDULE_STATUS.APPLY,
        },
      },
    );
    if (!tourGuideWorkScheduleFound) {
      throw new BadRequestException(
        MessageResponse.WORK_SCHEDULE.TOUR_GUIDE_OUTSIDE_OF_OPERATING_HOURS,
      );
    }

    const timeStartDelay = new Date(createFlightScheduleDto.start);
    timeStartDelay.setSeconds(timeStartDelay.getSeconds() - (15 * 60 - 1));

    const flightSchedule = await this.prisma.flightSchedule.findMany({
      where: {
        start: {
          lte: createFlightScheduleDto.start,
        },
        end: {
          gte: timeStartDelay,
        },
      },
    });
    if (flightSchedule.length >= 2) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.EXCEED_NUMBER,
      );
    }

    const sameRouteFlightSchedule = await this.prisma.flightSchedule.findMany({
      where: {
        routeId: createFlightScheduleDto.routeId,
        start: {
          lte: createFlightScheduleDto.start,
        },
        end: {
          gte: timeStartDelay,
        },
      },
    });
    if (sameRouteFlightSchedule.length > 0) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.EXCEED_NUMBER_SAME_ROUTE,
      );
    }

    const pilotFlightSchedule = await this.prisma.flightSchedule.findFirst({
      where: {
        start: {
          lte: createFlightScheduleDto.start,
        },
        end: {
          gte: timeStartDelay,
        },
        userFlightSchedule: {
          some: {
            userId: createFlightScheduleDto.pilotId,
          },
        },
      },
      include: {
        userFlightSchedule: {
          where: {
            userId: createFlightScheduleDto.pilotId,
          },
        },
      },
    });

    if (pilotFlightSchedule) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.PILOT_IN_PROCESS(
          pilotFlightSchedule.id,
        ),
      );
    }

    const tourGuideFlightSchedule = await this.prisma.flightSchedule.findFirst({
      where: {
        start: {
          lte: createFlightScheduleDto.start,
        },
        end: {
          gte: timeStartDelay,
        },
        userFlightSchedule: {
          some: {
            userId: createFlightScheduleDto.tourGuideId,
          },
        },
      },
      include: {
        userFlightSchedule: {
          where: {
            userId: createFlightScheduleDto.tourGuideId,
          },
        },
      },
    });

    if (tourGuideFlightSchedule) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.TOUR_GUIDE_IN_PROCESS(
          tourGuideFlightSchedule.id,
        ),
      );
    }

    const helicopterFlightSchedule = await this.prisma.flightSchedule.findFirst(
      {
        where: {
          helicopterId: createFlightScheduleDto.helicopterId,
          start: {
            lte: createFlightScheduleDto.start,
          },
          end: {
            gte: timeStartDelay,
          },
        },
      },
    );

    if (helicopterFlightSchedule) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.HELICOPTER_IN_PROCESS(
          helicopterFlightSchedule.id,
        ),
      );
    }

    // const dataCreateFlightSchedule = {
    //   routeId: createFlightScheduleDto.routeId,
    //   helicopterId: createFlightScheduleDto.helicopterId,
    //   date: new Date(endTime.setHours(7, 0, 0, 0)),
    //   start: createFlightScheduleDto.start,
    //   end: endTime,
    //   duration: routeFound.duration,
    //   status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
    //   price: routeFound.price ?? 0,
    //   capacity: createFlightScheduleDto.capacity,
    // };

    const dataCreateFlightSchedule = {
      ...createFlightScheduleDto,
      end: new Date(endTime),
      date: new Date(endTime.setHours(7, 0, 0, 0)),
      status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
      duration: routeFound.duration,
      price: routeFound.price ?? 0,
      type: ROUTE_TYPE.ADVENTURE,
    };
    delete dataCreateFlightSchedule.pilotId;
    delete dataCreateFlightSchedule.tourGuideId;

    const createFlightSchedule = await this.prisma.flightSchedule.create({
      data: dataCreateFlightSchedule,
    });

    await this.prisma.userFlightSchedule.create({
      data: {
        userId: customerId,
        flightScheduleId: createFlightSchedule.id,
      },
    });
    await this.prisma.userFlightSchedule.create({
      data: {
        userId: createFlightScheduleDto.pilotId,
        flightScheduleId: createFlightSchedule.id,
      },
    });
    await this.prisma.userFlightSchedule.create({
      data: {
        userId: createFlightScheduleDto.tourGuideId,
        flightScheduleId: createFlightSchedule.id,
      },
    });

    return {
      message: MessageResponse.FLIGHT_SCHEDULE.CREATE_SUCCESS,
      data: {
        ...createFlightSchedule,
        customerId,
        pilotId: createFlightScheduleDto.pilotId,
        tourGuideId: createFlightScheduleDto.tourGuideId,
      },
    };
  }

  async getListFlightSchedule(filter: FGetListFlightScheduleDto) {
    // const listAdventureOperatingTimeFound = await this.prisma.adventureOperatingTime.findMany({
    //   skip: (filter.page - 1) * filter.perPage,
    //   take: filter.perPage,
    //   orderBy: {
    //     capacity: 'asc',
    //   },
    // });

    let whereQuery = {};
    if (filter.start) {
      whereQuery = { ...whereQuery, start: { gte: filter.start } };
    }
    if (filter.end) {
      whereQuery = { ...whereQuery, end: { lte: filter.end } };
    }
    if (filter.userId) {
      whereQuery = {
        ...whereQuery,
        userFlightSchedule: {
          some: {
            userId: filter.userId,
          },
        },
      };
    }

    const listWorkScheduleFound = await this.prisma.flightSchedule.findMany({
      where: whereQuery,
    });

    return {
      message: MessageResponse.WORK_SCHEDULE.GET_LIST_SUCCESS,
      data: listWorkScheduleFound,
    };
  }
}

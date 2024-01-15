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
import { UserDataType } from 'src/common/types/user-data.type';
import { FGetAvailableResourceDto } from './dto/get-available-resource.dto';

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
        status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
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
        status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
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
        status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
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
          status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
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
        price: routeFound.price,
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
      where: { ...whereQuery, status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS },
    });

    return {
      message: MessageResponse.WORK_SCHEDULE.GET_LIST_SUCCESS,
      data: listWorkScheduleFound,
    };
  }

  async cancelFlightSchedule(id: number, userInfo: UserDataType) {
    const flightScheduleFound = await this.prisma.flightSchedule.findUnique({
      where: { id },
    });
    if (!flightScheduleFound) {
      throw new BadRequestException(MessageResponse.FLIGHT_SCHEDULE.NOT_EXIST);
    }

    const userBookingFound = await this.prisma.userFlightSchedule.findFirst({
      where: {
        userId: userInfo.id,
        flightScheduleId: id,
      },
    });
    if (!userBookingFound && userInfo.role === ROLE.CUSTOMER) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.FLIGHT_NOT_BELONG_TO_USER,
      );
    }

    const validDateCancel = new Date(flightScheduleFound.start);
    validDateCancel.setHours(validDateCancel.getHours() - 1);
    console.log(new Date());

    if (userInfo.role === ROLE.CUSTOMER && new Date() > validDateCancel) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.INVALID_TIME_CANCEL,
      );
    }

    await this.prisma.flightSchedule.update({
      where: {
        id,
      },
      data: {
        status: FLIGHT_SCHEDULE_STATUS.CANCEL,
      },
    });

    return {
      message: MessageResponse.FLIGHT_SCHEDULE.CANCEL_SUCCESS,
    };
  }

  async getListResourcesAvailable(filter: FGetAvailableResourceDto) {
    const pilotUsers = await this.prisma.user.findMany({
      where: {
        role: ROLE.PILOT,
        userFlightSchedule: {
          none: {
            flightSchedule: {
              AND: [
                { start: { lte: filter.end } },
                { end: { gte: filter.start } },
              ],
            },
          },
        },
        workSchedule: {
          some: {
            AND: [
              { startTime: { lte: filter.start } },
              { endTime: { gte: filter.end } },
              { status: WORK_SCHEDULE_STATUS.APPLY },
            ],
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        workSchedule: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    // const test1 = new Date("2024-01-15T00:00:00.000Z")
    // const test2 = new Date("2024-01-15T03:00:00.000Z")
    // console.log(test1 < test2)

    const tourGuideUsers = await this.prisma.user.findMany({
      where: {
        role: ROLE.TOUR_GUIDE,
        userFlightSchedule: {
          none: {
            flightSchedule: {
              AND: [
                { start: { lte: filter.end } },
                { end: { gte: filter.start } },
              ],
            },
          },
        },
        workSchedule: {
          some: {
            AND: [
              { startTime: { lte: filter.start } },
              { endTime: { gte: filter.end } },
              { status: WORK_SCHEDULE_STATUS.APPLY },
            ],
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        workSchedule: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    const helicopters = await this.prisma.helicopter.findMany({
      where: {
        flightSchedule: {
          none: {
            AND: [
              { start: { lte: filter.end } },
              { end: { gte: filter.start } },
            ],
          },
        },
      },
      select: {
        id: true,
        name: true,
        capacity: true,
        img: true,
        type: true,
        engine: true,
        speed: true,
      },
    });

    return {
      message: MessageResponse.COMMON.GET_LIST_AVAILABLE_RESOURCE_SUCCESS,
      data: {
        pilots: pilotUsers,
        tourGuides: tourGuideUsers,
        helicopters: helicopters,
      },
    };
  }
}

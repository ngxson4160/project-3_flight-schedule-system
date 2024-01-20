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
import { RequestHireHelicopterDto } from './dto/request-hire-helicopter.dto';
import { ResolveHireHelicopterDto } from './dto/resolve-hire-helicopter.dto';
import { UpdateFlightScheduleDto } from './dto/update-flight-schedule.dto';

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
    if (helicopterFound.capacity < createFlightScheduleDto.capacity) {
      throw new BadRequestException(MessageResponse.HELICOPTER.EXCEED_CAPACITY);
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
    if (filter.startDate) {
      whereQuery = { ...whereQuery, date: { gte: filter.startDate } };
    }
    if (filter.end) {
      whereQuery = { ...whereQuery, date: { lte: filter.endDate } };
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
    if (filter.status) {
      whereQuery = {
        ...whereQuery,
        status: filter.status,
      };
    }
    if (filter.type) {
      whereQuery = {
        ...whereQuery,
        type: filter.type,
      };
    }

    const listWorkScheduleFound = await this.prisma.flightSchedule.findMany({
      where: { ...whereQuery },
      include: {
        NoteRequestHireHelicopter: {
          select: {
            message: true,
            userId: true,
            role: true,
          },
        },
      },
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

  async requestHireHelicopter(
    customerId: number,
    requestHireDto: RequestHireHelicopterDto,
  ) {
    const dateBooking = getDateWithoutTime(requestHireDto.start);
    if (requestHireDto.start >= requestHireDto.end) {
      throw new BadRequestException(
        MessageResponse.COMMON.INVALID_TIME_START_AND_END,
      );
    }

    const customerFound = await this.prisma.user.findUnique({
      where: { id: customerId, role: ROLE.CUSTOMER },
    });
    if (!customerFound) {
      throw new BadRequestException(MessageResponse.USER.CUSTOMER_NOT_EXIST);
    }
    let pilotFound;
    if (requestHireDto!.pilotId) {
      pilotFound = await this.prisma.user.findUnique({
        where: { id: requestHireDto.pilotId, role: ROLE.PILOT },
      });
      if (!pilotFound) {
        throw new BadRequestException(MessageResponse.USER.PILOT_NOT_EXIST);
      }
    }

    let tourGuideFound;
    if (requestHireDto!.tourGuideId) {
      tourGuideFound = await this.prisma.user.findUnique({
        where: { id: requestHireDto.tourGuideId, role: ROLE.TOUR_GUIDE },
      });
      if (!tourGuideFound) {
        throw new BadRequestException(
          MessageResponse.USER.TOUR_GUIDE_NOT_EXIST,
        );
      }
    }

    const routeFound = await this.prisma.route.findUnique({
      where: { id: requestHireDto.routeId },
    });
    if (!routeFound) {
      throw new BadRequestException(MessageResponse.ROUTE.NOT_EXIST);
    }

    const helicopterFound = await this.prisma.helicopter.findUnique({
      where: { id: requestHireDto.helicopterId },
    });
    if (!helicopterFound) {
      throw new BadRequestException(MessageResponse.HELICOPTER.NOT_EXIST);
    }
    if (helicopterFound.capacity < requestHireDto.capacity) {
      throw new BadRequestException(MessageResponse.HELICOPTER.EXCEED_CAPACITY);
    }

    const endTime = new Date(requestHireDto.end);

    // const adventureOperatingTimeFound =
    //   await this.prisma.adventureOperatingTime.findFirst({
    //     where: { date: dateBooking },
    //   });

    // if (!adventureOperatingTimeFound) {
    //   throw new BadRequestException(
    //     MessageResponse.ADVENTURE_OPERATING_TIME.NOT_EXIST,
    //   );
    // }

    // if (
    //   (new Date(requestHireDto.start) <
    //     adventureOperatingTimeFound.startMorning ||
    //     endTime > adventureOperatingTimeFound.endMorning) &&
    //   (new Date(requestHireDto.start) <
    //     adventureOperatingTimeFound.startAfternoon ||
    //     endTime > adventureOperatingTimeFound.endAfternoon)
    // ) {
    //   throw new BadRequestException(
    //     MessageResponse.ADVENTURE_OPERATING_TIME.OUTSIDE_OF_OPERATING_HOURS,
    //   );
    // }

    let pilotWorkScheduleFound;
    if (pilotFound) {
      pilotWorkScheduleFound = await this.prisma.workSchedule.findFirst({
        where: {
          userId: requestHireDto.pilotId,
          date: dateBooking,
          startTime: { lte: requestHireDto.start },
          endTime: { gte: endTime },
          status: WORK_SCHEDULE_STATUS.APPLY,
        },
      });
      if (!pilotWorkScheduleFound) {
        throw new BadRequestException(
          MessageResponse.WORK_SCHEDULE.PILOT_OUTSIDE_OF_OPERATING_HOURS,
        );
      }
    }

    let tourGuideWorkScheduleFound;
    if (tourGuideFound) {
      tourGuideWorkScheduleFound = await this.prisma.workSchedule.findFirst({
        where: {
          userId: requestHireDto.tourGuideId,
          date: dateBooking,
          startTime: { lte: requestHireDto.start },
          endTime: { gte: endTime },
          status: WORK_SCHEDULE_STATUS.APPLY,
        },
      });
      if (!tourGuideWorkScheduleFound) {
        throw new BadRequestException(
          MessageResponse.WORK_SCHEDULE.TOUR_GUIDE_OUTSIDE_OF_OPERATING_HOURS,
        );
      }
    }

    const timeStartDelay = new Date(requestHireDto.start);
    timeStartDelay.setSeconds(timeStartDelay.getSeconds() - (15 * 60 - 1));

    // const flightSchedule = await this.prisma.flightSchedule.findMany({
    //   where: {
    //     start: {
    //       lte: requestHireDto.start,
    //     },
    //     end: {
    //       gte: timeStartDelay,
    //     },
    //   },
    // });
    // if (flightSchedule.length >= 2) {
    //   throw new BadRequestException(
    //     MessageResponse.FLIGHT_SCHEDULE.EXCEED_NUMBER,
    //   );
    // }

    // const sameRouteFlightSchedule = await this.prisma.flightSchedule.findMany({
    //   where: {
    //     routeId: requestHireDto.routeId,
    //     start: {
    //       lte: requestHireDto.start,
    //     },
    //     end: {
    //       gte: timeStartDelay,
    //     },
    //     status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
    //   },
    // });
    // if (sameRouteFlightSchedule.length > 0) {
    //   throw new BadRequestException(
    //     MessageResponse.FLIGHT_SCHEDULE.EXCEED_NUMBER_SAME_ROUTE,
    //   );
    // }

    let pilotFlightSchedule;
    if (pilotFound) {
      pilotFlightSchedule = await this.prisma.flightSchedule.findFirst({
        where: {
          start: {
            lte: requestHireDto.start,
          },
          end: {
            gte: timeStartDelay,
          },
          userFlightSchedule: {
            some: {
              userId: requestHireDto.pilotId,
            },
          },
          status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
        },
        include: {
          userFlightSchedule: {
            where: {
              userId: requestHireDto.pilotId,
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
    }

    let tourGuideFlightSchedule;
    if (tourGuideFound) {
      tourGuideFlightSchedule = await this.prisma.flightSchedule.findFirst({
        where: {
          start: {
            lte: requestHireDto.start,
          },
          end: {
            gte: timeStartDelay,
          },
          userFlightSchedule: {
            some: {
              userId: requestHireDto.tourGuideId,
            },
          },
          status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
        },
        include: {
          userFlightSchedule: {
            where: {
              userId: requestHireDto.tourGuideId,
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
    }

    const helicopterFlightSchedule = await this.prisma.flightSchedule.findFirst(
      {
        where: {
          helicopterId: requestHireDto.helicopterId,
          start: {
            lte: requestHireDto.start,
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
    //   routeId: requestHireDto.routeId,
    //   helicopterId: requestHireDto.helicopterId,
    //   date: new Date(endTime.setHours(7, 0, 0, 0)),
    //   start: requestHireDto.start,
    //   end: endTime,
    //   duration: routeFound.duration,
    //   status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
    //   price: routeFound.price ?? 0,
    //   capacity: requestHireDto.capacity,
    // };

    const duration =
      new Date(requestHireDto.end).getTime() -
      new Date(requestHireDto.start).getTime();
    const date = new Date(requestHireDto.start);
    const reasonHire = requestHireDto.purpose;
    const dataCreateFlightSchedule = {
      ...requestHireDto,
      date: new Date(date.setHours(7, 0, 0, 0)),
      status: FLIGHT_SCHEDULE_STATUS.PENDING_HIRE,
      duration: duration / 1000,
      type: ROUTE_TYPE.HIRE,
      price: 0,
    };
    delete dataCreateFlightSchedule.pilotId;
    delete dataCreateFlightSchedule.tourGuideId;
    delete dataCreateFlightSchedule.purpose;

    const createFlightSchedule = await this.prisma.flightSchedule.create({
      data: dataCreateFlightSchedule,
    });

    await this.prisma.userFlightSchedule.create({
      data: {
        userId: customerId,
        flightScheduleId: createFlightSchedule.id,
      },
    });
    if (requestHireDto.pilotId) {
      await this.prisma.userFlightSchedule.create({
        data: {
          userId: requestHireDto.pilotId,
          flightScheduleId: createFlightSchedule.id,
          price: 0,
        },
      });
    }
    if (requestHireDto.tourGuideId) {
      await this.prisma.userFlightSchedule.create({
        data: {
          userId: requestHireDto.tourGuideId,
          flightScheduleId: createFlightSchedule.id,
        },
      });
    }
    await this.prisma.noteRequestHireHelicopter.create({
      data: {
        message: reasonHire,
        role: ROLE.CUSTOMER,
        userId: customerId,
        flightScheduleId: createFlightSchedule.id,
      },
    });

    return {
      message: MessageResponse.FLIGHT_SCHEDULE.CREATE_SUCCESS,
      data: {
        ...createFlightSchedule,
        customerId,
        pilotId: requestHireDto.pilotId,
        tourGuideId: requestHireDto.tourGuideId,
      },
    };
  }

  async resolveHireHelicopter(
    id: number,
    adminInfo: UserDataType,
    resolveHireHelicopter: ResolveHireHelicopterDto,
  ) {
    if (
      resolveHireHelicopter.start &&
      resolveHireHelicopter.end &&
      resolveHireHelicopter.start >= resolveHireHelicopter.end
    ) {
      throw new BadRequestException(
        MessageResponse.COMMON.INVALID_TIME_START_AND_END,
      );
    }

    if (resolveHireHelicopter.price && !resolveHireHelicopter.isAccept) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.INVALID_RESOLVE_HIRE_PRICE,
      );
    }

    const adminFound = await this.prisma.user.findUnique({
      where: { id: adminInfo.id },
    });
    if (!adminFound) {
      throw new BadRequestException(MessageResponse.USER.NOT_EXIST);
    }

    const flightScheduleHireFound = await this.prisma.flightSchedule.findFirst({
      where: {
        id,
        type: ROUTE_TYPE.HIRE,
      },
    });
    if (!flightScheduleHireFound) {
      throw new BadRequestException(
        MessageResponse.FLIGHT_SCHEDULE.NOT_EXIST_REQUEST_HIRE,
      );
    }

    const noteResolveHireChangeFound =
      await this.prisma.noteRequestHireHelicopter.findFirst({
        where: {
          flightScheduleId: flightScheduleHireFound.id,
          userId: adminInfo.id,
        },
      });
    if (noteResolveHireChangeFound) {
      await this.prisma.noteRequestHireHelicopter.update({
        where: { id: noteResolveHireChangeFound.id },
        data: {
          message: resolveHireHelicopter.reason,
        },
      });
    } else {
      await this.prisma.noteRequestHireHelicopter.create({
        data: {
          userId: adminInfo.id,
          flightScheduleId: flightScheduleHireFound.id,
          message: resolveHireHelicopter.reason,
          role: adminInfo.role,
        },
      });
    }

    let timeUpdate = {};
    if (resolveHireHelicopter.start) {
      timeUpdate = { ...timeUpdate, start: resolveHireHelicopter.start };
    }
    if (resolveHireHelicopter.end) {
      timeUpdate = { ...timeUpdate, end: resolveHireHelicopter.end };
    }

    await this.prisma.flightSchedule.update({
      where: {
        id: flightScheduleHireFound.id,
      },
      data: {
        ...timeUpdate,
        status: resolveHireHelicopter.isAccept
          ? FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS
          : FLIGHT_SCHEDULE_STATUS.REJECT_HIRE,
      },
    });

    if (resolveHireHelicopter.price) {
      await this.prisma.userFlightSchedule.updateMany({
        where: {
          flightScheduleId: flightScheduleHireFound.id,
        },
        data: {
          price: resolveHireHelicopter.price,
        },
      });
    }

    return {
      message: MessageResponse.FLIGHT_SCHEDULE.RESOLVE_HIRE_SUCCESS,
    };
  }

  async updateAdventureFlightSchedule(
    id: number,
    customerId: number,
    updateFlightScheduleDto: UpdateFlightScheduleDto,
  ) {
    const customerFound = await this.prisma.user.findUnique({
      where: { id: customerId, role: ROLE.CUSTOMER },
    });
    if (!customerFound) {
      throw new BadRequestException(MessageResponse.USER.CUSTOMER_NOT_EXIST);
    }

    const flightScheduleFound = await this.prisma.flightSchedule.findUnique({
      where: { id },
      include: {
        userFlightSchedule: {
          include: {
            user: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
      },
    });
    if (!flightScheduleFound) {
      throw new BadRequestException(MessageResponse.FLIGHT_SCHEDULE.NOT_EXIST);
    }
    console.log(flightScheduleFound);

    let pilotIdFind;
    if (updateFlightScheduleDto.pilotId) {
      pilotIdFind = updateFlightScheduleDto.pilotId;
    } else {
      // pilotIdFind = flightScheduleFound.pilotId;
    }
    const pilotFound = await this.prisma.user.findUnique({
      where: { id: updateFlightScheduleDto.pilotId, role: ROLE.PILOT },
    });
    if (!pilotFound) {
      throw new BadRequestException(MessageResponse.USER.PILOT_NOT_EXIST);
    }

    const tourGuideFound = await this.prisma.user.findUnique({
      where: { id: updateFlightScheduleDto.tourGuideId, role: ROLE.TOUR_GUIDE },
    });
    if (!tourGuideFound) {
      throw new BadRequestException(MessageResponse.USER.TOUR_GUIDE_NOT_EXIST);
    }

    const routeFound = await this.prisma.route.findUnique({
      where: { id: updateFlightScheduleDto.routeId },
    });
    if (!routeFound) {
      throw new BadRequestException(MessageResponse.ROUTE.NOT_EXIST);
    }

    const helicopterFound = await this.prisma.helicopter.findUnique({
      where: { id: updateFlightScheduleDto.helicopterId },
    });
    if (!helicopterFound) {
      throw new BadRequestException(MessageResponse.HELICOPTER.NOT_EXIST);
    }
    if (helicopterFound.capacity < updateFlightScheduleDto.capacity) {
      throw new BadRequestException(MessageResponse.HELICOPTER.EXCEED_CAPACITY);
    }

    let dateBooking;
    if (updateFlightScheduleDto.start) {
      dateBooking = getDateWithoutTime(updateFlightScheduleDto.start);
    } else {
      dateBooking = getDateWithoutTime(flightScheduleFound.start);
    }

    const endTime = new Date(updateFlightScheduleDto.start);
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
      (new Date(updateFlightScheduleDto.start) <
        adventureOperatingTimeFound.startMorning ||
        endTime > adventureOperatingTimeFound.endMorning) &&
      (new Date(updateFlightScheduleDto.start) <
        adventureOperatingTimeFound.startAfternoon ||
        endTime > adventureOperatingTimeFound.endAfternoon)
    ) {
      throw new BadRequestException(
        MessageResponse.ADVENTURE_OPERATING_TIME.OUTSIDE_OF_OPERATING_HOURS,
      );
    }

    const pilotWorkScheduleFound = await this.prisma.workSchedule.findFirst({
      where: {
        userId: updateFlightScheduleDto.pilotId,
        date: dateBooking,
        startTime: { lte: updateFlightScheduleDto.start },
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
          userId: updateFlightScheduleDto.tourGuideId,
          date: dateBooking,
          startTime: { lte: updateFlightScheduleDto.start },
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

    const timeStartDelay = new Date(updateFlightScheduleDto.start);
    timeStartDelay.setSeconds(timeStartDelay.getSeconds() - (15 * 60 - 1));

    const flightSchedule = await this.prisma.flightSchedule.findMany({
      where: {
        start: {
          lte: updateFlightScheduleDto.start,
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
        routeId: updateFlightScheduleDto.routeId,
        start: {
          lte: updateFlightScheduleDto.start,
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
          lte: updateFlightScheduleDto.start,
        },
        end: {
          gte: timeStartDelay,
        },
        userFlightSchedule: {
          some: {
            userId: updateFlightScheduleDto.pilotId,
          },
        },
        status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
      },
      include: {
        userFlightSchedule: {
          where: {
            userId: updateFlightScheduleDto.pilotId,
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
          lte: updateFlightScheduleDto.start,
        },
        end: {
          gte: timeStartDelay,
        },
        userFlightSchedule: {
          some: {
            userId: updateFlightScheduleDto.tourGuideId,
          },
        },
        status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
      },
      include: {
        userFlightSchedule: {
          where: {
            userId: updateFlightScheduleDto.tourGuideId,
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
          helicopterId: updateFlightScheduleDto.helicopterId,
          start: {
            lte: updateFlightScheduleDto.start,
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
    //   routeId: updateFlightScheduleDto.routeId,
    //   helicopterId: updateFlightScheduleDto.helicopterId,
    //   date: new Date(endTime.setHours(7, 0, 0, 0)),
    //   start: updateFlightScheduleDto.start,
    //   end: endTime,
    //   duration: routeFound.duration,
    //   status: FLIGHT_SCHEDULE_STATUS.BOOKING_SUCCESS,
    //   price: routeFound.price ?? 0,
    //   capacity: updateFlightScheduleDto.capacity,
    // };

    const dataCreateFlightSchedule = {
      ...updateFlightScheduleDto,
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
        userId: updateFlightScheduleDto.pilotId,
        flightScheduleId: createFlightSchedule.id,
        price: routeFound.price,
      },
    });
    await this.prisma.userFlightSchedule.create({
      data: {
        userId: updateFlightScheduleDto.tourGuideId,
        flightScheduleId: createFlightSchedule.id,
      },
    });

    return {
      message: MessageResponse.FLIGHT_SCHEDULE.CREATE_SUCCESS,
      data: {
        ...createFlightSchedule,
        customerId,
        pilotId: updateFlightScheduleDto.pilotId,
        tourGuideId: updateFlightScheduleDto.tourGuideId,
      },
    };
  }
}

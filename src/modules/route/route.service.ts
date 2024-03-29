import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRouteDto, GetListRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { ROUTE_TYPE } from '@prisma/client';

@Injectable()
export class RouteService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoute(createRouteDto: CreateRouteDto) {
    const newRoute = await this.prisma.route.create({
      data: createRouteDto,
    });
    return {
      message: MessageResponse.ROUTE.CREATE_SUCCESS,
      data: newRoute,
    };
  }

  async updateRoute(id: number, updateRouteDto: UpdateRouteDto) {
    const routeFound = await this.prisma.route.findUnique({
      where: { id },
    });

    if (Object.keys(updateRouteDto).length === 0) {
      throw new BadRequestException(MessageResponse.COMMON.UPDATE_EMPTY_OBJECT);
    }

    if (!routeFound) {
      throw new BadRequestException(MessageResponse.ROUTE.NOT_EXIST);
    }

    const routeUpdated = await this.prisma.route.update({
      where: {
        id,
      },
      data: updateRouteDto,
    });
    return {
      message: MessageResponse.ROUTE.UPDATE_SUCCESS,
      data: routeUpdated,
    };
  }

  async getDetailRoute(id: number) {
    const routeFound = await this.prisma.route.findUnique({
      where: { id },
    });

    if (!routeFound) {
      throw new BadRequestException(MessageResponse.ROUTE.NOT_EXIST);
    }

    return {
      message: MessageResponse.ROUTE.GET_DETAIL_SUCCESS,
      data: routeFound,
    };
  }

  async getListRoute(type?: GetListRouteDto) {
    let where;
    if (type) {
      where = { isDelete: 0, type };
    } else {
      where = { isDelete: 0 };
    }
    const listRouteFound = await this.prisma.route.findMany({
      where,
    });

    return {
      message: MessageResponse.ROUTE.GET_LIST_SUCCESS,
      data: listRouteFound,
    };
  }

  async deleteRoute(id: number) {
    console.log(id);
    const routeFound = await this.prisma.route.findUnique({
      where: { id },
    });

    if (!routeFound) {
      throw new BadRequestException(MessageResponse.ROUTE.NOT_EXIST);
    }

    const deleteRoute = await this.prisma.route.update({
      where: {
        id,
      },
      data: {
        isDelete: 1,
      },
    });

    return {
      message: MessageResponse.ROUTE.DELETE_SUCCESS,
      data: deleteRoute,
    };
  }
}

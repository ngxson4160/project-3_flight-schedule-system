import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewHelicopterDto } from './dto/create-helicopter.dto';
import { MessageResponse } from 'src/constants/message-response.constant';
import { OrderByHelicopterDto } from './dto/filter-helicopter';
import { SortOrder } from 'src/constants/enum.constant';
import { FilterOptions } from 'src/common/dtos/filter-options.dto';

@Injectable()
export class HelicopterService {
  constructor(private readonly prisma: PrismaService) {}

  async createHelicopter(newHelicopterDto: NewHelicopterDto) {
    const helicopterFound = await this.prisma.helicopter.findUnique({
      where: { name: newHelicopterDto.name },
    });

    if (helicopterFound) {
      throw new BadRequestException(MessageResponse.HELICOPTER.EXIST);
    }

    const newHelicopter = await this.prisma.helicopter.create({
      data: newHelicopterDto,
    });
    return {
      message: MessageResponse.HELICOPTER.CREATE_SUCCESS,
      data: newHelicopter,
    };
  }

  async updateHelicopter(id: number, newHelicopterDto: NewHelicopterDto) {
    const helicopterFound = await this.prisma.helicopter.findUnique({
      where: { id },
    });

    if (!helicopterFound) {
      throw new BadRequestException(MessageResponse.HELICOPTER.NOT_EXIST);
    }

    const newHelicopter = await this.prisma.helicopter.update({
      where: {
        id,
      },
      data: newHelicopterDto,
    });
    return {
      message: MessageResponse.HELICOPTER.UPDATE_SUCCESS,
      data: newHelicopter,
    };
  }

  async getDetailHelicopter(id: number) {
    const helicopterFound = await this.prisma.helicopter.findUnique({
      where: { id },
    });

    if (!helicopterFound) {
      throw new BadRequestException(MessageResponse.HELICOPTER.NOT_EXIST);
    }

    return {
      message: MessageResponse.HELICOPTER.GET_DETAIL_SUCCESS,
      data: helicopterFound,
    };
  }

  async getListHelicopter() {
    // const listHelicopterFound = await this.prisma.helicopter.findMany({
    //   skip: (filter.page - 1) * filter.perPage,
    //   take: filter.perPage,
    //   orderBy: {
    //     capacity: 'asc',
    //   },
    // });

    const listHelicopterFound = await this.prisma.helicopter.findMany();
    
    return {
      message: MessageResponse.HELICOPTER.GET_LIST_SUCCESS,
      data: listHelicopterFound,
    };
  }

  async deleteHelicopter(id: number) {
    const helicopterFound = await this.prisma.helicopter.findUnique({
      where: { id },
    });

    if (!helicopterFound) {
      throw new BadRequestException(MessageResponse.HELICOPTER.NOT_EXIST);
    }

    const deleteHelicopter = await this.prisma.helicopter.delete({
      where: {
        id,
      },
    });

    return {
      message: MessageResponse.HELICOPTER.DELETE_SUCCESS,
      data: deleteHelicopter,
    };
  }
}

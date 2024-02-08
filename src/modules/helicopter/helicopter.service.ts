import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewHelicopterDto } from './dto/create-helicopter.dto';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { OrderByHelicopterDto } from './dto/filter-helicopter';
import { SortOrder } from 'src/common/constants/enum.constant';
import { FilterOptions } from 'src/common/dtos/filter-options.dto';
import { UpdateHelicopterDto } from './dto/update-helicopter.dto';

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

  async updateHelicopter(id: number, updateHelicopterDto: UpdateHelicopterDto) {
    const helicopterFound = await this.prisma.helicopter.findUnique({
      where: { id },
    });

    if (!helicopterFound) {
      throw new BadRequestException(MessageResponse.HELICOPTER.NOT_EXIST);
    }

    if (updateHelicopterDto.name) {
      const helicopterFound = await this.prisma.helicopter.findUnique({
        where: { name: updateHelicopterDto.name },
      });
      if (helicopterFound) {
        throw new BadRequestException(MessageResponse.HELICOPTER.EXIST);
      }
    }

    const newHelicopter = await this.prisma.helicopter.update({
      where: {
        id,
      },
      data: updateHelicopterDto,
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

    const listHelicopterFound = await this.prisma.helicopter.findMany({
      where: { isDelete: 0 },
    });

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

    const deleteHelicopter = await this.prisma.helicopter.update({
      where: {
        id,
      },
      data: {
        isDelete: 1,
      },
    });

    return {
      message: MessageResponse.HELICOPTER.DELETE_SUCCESS,
      data: deleteHelicopter,
    };
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewHelicopterDto } from './dto/create-helicopter.dto';
import { MessageResponse } from 'src/constants/message-response.constant';

@Injectable()
export class HelicopterService {
  constructor(private readonly prisma: PrismaService) {}

  async createHelicopter(newHelicopterDto: NewHelicopterDto) {
    const newHelicopter = await this.prisma.helicopter.create({
      data: newHelicopterDto,
    });
    return {
      message: MessageResponse.HELICOPTER.CREATE_SUCCESS,
      data: newHelicopter,
    };
  }
}

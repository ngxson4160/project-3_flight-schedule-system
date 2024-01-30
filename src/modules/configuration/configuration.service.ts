import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageResponse } from 'src/common/constants/message-response.constant';

@Injectable()
export class ConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  async getValue(key: string) {
    const dataFound = await this.prisma.configuration.findFirst({
      where: { key },
    });

    dataFound.value = JSON.parse(dataFound.value);
    return {
      message: MessageResponse.CONFIGURATION.GET_VALUE_SUCCESS,
      data: dataFound,
    };
  }
}

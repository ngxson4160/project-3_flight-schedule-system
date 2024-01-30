import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';
import { ConfigurationService } from './configuration.service';

@Controller('configurations')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  @Role(ROLE.ADMIN)
  async createHelicopter(@Query('key') key: string) {
    return this.configurationService.getValue(key);
  }
}

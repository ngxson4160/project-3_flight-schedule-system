import { Body, Controller, Get, Post } from '@nestjs/common';
import { HelicopterService } from './helicopter.service';
import { NewHelicopterDto } from './dto/create-helicopter.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';

@Controller('helicopter')
export class HelicopterController {
  constructor(private readonly helicopterService: HelicopterService) {}

  @Post()
  @Role(ROLE.ADMIN)
  async createHelicopter(@Body() newHelicopterDto: NewHelicopterDto) {
    return this.helicopterService.createHelicopter(newHelicopterDto);
  }
}

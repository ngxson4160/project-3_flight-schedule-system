import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HelicopterService } from './helicopter.service';
import { NewHelicopterDto } from './dto/create-helicopter.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';
import { UpdateHelicopterDto,  } from './dto/update-helicopter.dto';

@Controller('helicopters')
export class HelicopterController {
  constructor(private readonly helicopterService: HelicopterService) {}

  @Post()
  @Role(ROLE.ADMIN)
  async createHelicopter(@Body() newHelicopterDto: NewHelicopterDto) {
    return this.helicopterService.createHelicopter(newHelicopterDto);
  }

  @Put('/:id')
  @Role(ROLE.ADMIN)
  async updateHelicopter(
    @Body() updateHelicopterDto: UpdateHelicopterDto,
    @Param('id') id: string,
  ) {
    return this.helicopterService.updateHelicopter(+id, updateHelicopterDto);
  }

  @Get('/:id')
  async getDetailHelicopter(@Param('id') id: string) {
    return this.helicopterService.getDetailHelicopter(+id);
  }

  @Get()
  async getListHelicopter() {
    return this.helicopterService.getListHelicopter();
  }

  @Delete('/:id')
  @Role(ROLE.ADMIN)
  async deleteHelicopter(@Param('id') id: string) {
    return this.helicopterService.deleteHelicopter(+id);
  }
}

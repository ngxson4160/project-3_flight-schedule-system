import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdventureOperatingTimeService } from './adventure-operating-time.service';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';
import { AdventureOperatingTimeDto } from './dto/create-adventure-operating-time.dto';
import { FGetListAdventureOperatingTimeDto } from './dto/get-list-adventure-operating-time.dto';

@Controller('adventure-operating-times')
export class AdventureOperatingTimeController {
  constructor(
    private readonly adventureOperatingTimeService: AdventureOperatingTimeService,
  ) {}

  @Post()
  @Role(ROLE.ADMIN)
  async createHelicopter(
    @Body()
    adventureOperatingTime: AdventureOperatingTimeDto,
  ) {
    return this.adventureOperatingTimeService.createAdventureOperatingTime(
      adventureOperatingTime,
    );
  }

  @Put('/:id')
  @Role(ROLE.ADMIN)
  async updateAdventureOperatingTime(
    @Body() updateAdventureOperatingTime: AdventureOperatingTimeDto,
    @Param('id') id: string,
  ) {
    return this.adventureOperatingTimeService.updateAdventureOperatingTime(
      +id,
      updateAdventureOperatingTime,
    );
  }

  @Get()
  async getListAdventureOperatingTime(
    @Body() getListAdventureOperatingTime: FGetListAdventureOperatingTimeDto,
  ) {
    return this.adventureOperatingTimeService.getListAdventureOperatingTime(
      getListAdventureOperatingTime,
    );
  }

  @Delete('/:id')
  @Role(ROLE.ADMIN)
  async deleteHelicopter(@Param('id') id: string) {
    return this.adventureOperatingTimeService.deleteAdventureOperatingTime(+id);
  }
}

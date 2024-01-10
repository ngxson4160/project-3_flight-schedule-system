import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { FGetListWorkScheduleDto } from '../work-schedule/dto/get-list-work-schedule.dto';
import { UserData } from 'src/auth/decorator/user-info.decorator';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from 'src/common/constants/enum.constant';
import { UserDataType } from 'src/common/types/user-data.type';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/work-schedule')
  @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE)
  async getListWorkScheduleByUserId(
    @Body() getWorkScheduleService: FGetListWorkScheduleDto,
    @UserData() userInfo: UserDataType,
  ) {
    return this.userService.getListWorkScheduleByUserId(
      userInfo.id,
      getWorkScheduleService,
    );
  }

  @Put('/work-schedule/:id')
  @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE)
  async requestUpdateWorkSchedule(
    @Body() updateWorkSchedule: UpdateWorkScheduleDto,
    @UserData() userInfo: UserDataType,
    @Param('id') workScheduleId: string,
  ) {
    return this.userService.requestUpdateWorkSchedule(
      userInfo.id,
      +workScheduleId,
      updateWorkSchedule,
    );
  }
}

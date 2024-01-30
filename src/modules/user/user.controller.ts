import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FGetListWorkScheduleDto } from '../work-schedule/dto/get-list-work-schedule.dto';
import { UserData } from 'src/auth/decorator/user-info.decorator';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from 'src/common/constants/enum.constant';
import { UserDataType } from 'src/common/types/user-data.type';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule';
import { EStaff } from './dto/get-list-staff.dto';

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

  @Get()
  @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE)
  async getListStaffByTYpe(@Query('type') type: EStaff) {
    return this.userService.getListStaffByType(type);
  }

  @Get('/list-staff')
  @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE)
  async getListStaff() {
    return this.userService.getListStaff();
  }

  @Get(':id')
  @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE, ROLE.CUSTOMER)
  async getDetail(@Param('id') id: string) {
    return this.userService.getDetail(+id);
  }

  // @Put('/work-schedule/:id')
  // @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE)
  // async requestUpdateWorkSchedule(
  //   @Body() updateWorkSchedule: UpdateWorkScheduleDto,
  //   @UserData() userInfo: UserDataType,
  //   @Param('id') workScheduleId: string,
  // ) {
  //   return this.userService.requestUpdateWorkSchedule(
  //     userInfo.id,
  //     +workScheduleId,
  //     updateWorkSchedule,
  //   );
  // }

  // @Get('/work-schedule/:id')
  // @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.TOUR_GUIDE)
  // async getWorkSchedule(@Param('id') workScheduleId: string) {
  //   return this.userService.getWorkSchedule(+workScheduleId);
  // }
}

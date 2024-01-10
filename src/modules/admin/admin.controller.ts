import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from 'src/common/constants/enum.constant';
import { AdminService } from './admin.service';
import { ResolveRequestUpdateWorkScheduleDto } from './dto/update-work-schedule';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('/work-schedule/:id/resolve-request-update')
  @Role(ROLE.ADMIN)
  async resolveUpdateWorkSchedule(
    @Param('id') workScheduleId: string,
    data: ResolveRequestUpdateWorkScheduleDto,
  ) {
    return this.adminService.resolveUpdateWorkSchedule(
      +workScheduleId,
      data.isAccept,
    );
  }
}

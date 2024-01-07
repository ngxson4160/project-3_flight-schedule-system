import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFlightScheduleService } from './user-flight-schedule.service';
import { UserFlightScheduleController } from './user-flight-schedule.controller';

@Module({
  imports: [],
  providers: [UserFlightScheduleService, PrismaService],
  controllers: [UserFlightScheduleController],
  exports: [UserFlightScheduleService, PrismaService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FlightScheduleService } from './flight-schedule.service';
import { FlightScheduleController } from './flight-schedule.controller';

@Module({
  imports: [],
  providers: [FlightScheduleService, PrismaService],
  controllers: [FlightScheduleController],
  exports: [FlightScheduleService, PrismaService],
})
export class UserModule {}

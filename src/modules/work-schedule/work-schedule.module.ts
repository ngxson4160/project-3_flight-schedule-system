import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkScheduleService } from './work-schedule.service';
import { WorkScheduleController } from './work-schedule.controller';

@Module({
  imports: [],
  providers: [WorkScheduleService, PrismaService],
  controllers: [WorkScheduleController],
  exports: [WorkScheduleService, PrismaService],
})
export class UserModule {}

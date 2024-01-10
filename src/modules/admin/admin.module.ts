import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [],
  providers: [AdminService, PrismaService],
  controllers: [AdminController],
  exports: [AdminService, PrismaService],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HelicopterService } from './helicopter.service';
import { HelicopterController } from './helicopter.controller';

@Module({
  imports: [],
  providers: [HelicopterService, PrismaService],
  controllers: [HelicopterController],
  exports: [HelicopterService, PrismaService],
})
export class HelicopterModule {}

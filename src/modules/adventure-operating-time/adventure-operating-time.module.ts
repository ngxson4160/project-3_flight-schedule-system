import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdventureOperatingTimeService } from './adventure-operating-time.service';
import { AdventureOperatingTimeController } from './adventure-operating-time.controller';

@Module({
  imports: [],
  providers: [AdventureOperatingTimeService, PrismaService],
  controllers: [AdventureOperatingTimeController],
  exports: [AdventureOperatingTimeService, PrismaService],
})
export class AdventureOperatingTimeModule {}

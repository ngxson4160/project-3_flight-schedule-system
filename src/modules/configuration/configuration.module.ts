import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';

@Module({
  imports: [],
  providers: [ConfigurationService, PrismaService],
  controllers: [ConfigurationController],
  exports: [ConfigurationService, PrismaService],
})
export class ConfigurationModule {}

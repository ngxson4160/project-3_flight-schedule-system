import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [],
  providers: [RouteService, PrismaService],
  controllers: [RouteController],
  exports: [RouteService, PrismaService],
})
export class UserModule {}

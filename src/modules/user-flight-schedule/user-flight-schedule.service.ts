import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserFlightScheduleService {
  constructor(private readonly prisma: PrismaService) {}
}

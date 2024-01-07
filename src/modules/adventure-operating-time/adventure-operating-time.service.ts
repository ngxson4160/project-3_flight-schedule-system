import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdventureOperatingTimeService {
  constructor(private readonly prisma: PrismaService) {}
}

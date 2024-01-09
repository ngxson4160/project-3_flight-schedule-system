import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { MessageResponse } from 'src/common/constants/message-response.constant';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
}

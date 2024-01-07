import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStratey } from './strategies/jwt-access.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UserModule],
  providers: [AuthService, AccessTokenStratey],
  controllers: [AuthController],
})
export class AuthModule {}

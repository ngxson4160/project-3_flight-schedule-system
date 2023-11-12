import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStratey } from './strategies/jwt-access.strategy';

@Module({
  imports: [],
  providers: [AuthService, AccessTokenStratey],
  controllers: [AuthController],
})
export class AuthModule {}

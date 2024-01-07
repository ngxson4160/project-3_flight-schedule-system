import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guards/jwt-access.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}

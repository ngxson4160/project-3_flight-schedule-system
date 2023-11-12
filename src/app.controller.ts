import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guards/jwt-access.guard';
import { Permission } from './auth/decorator/role.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @Permission('rskf')
  getHello(): string {
    return this.appService.getHello();
  }
}

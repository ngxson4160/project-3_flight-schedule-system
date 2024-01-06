import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller()
export class PermissionController {
  constructor(private readonly appService: PermissionService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

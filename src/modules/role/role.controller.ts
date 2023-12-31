import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  constructor(private readonly appService: RoleService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

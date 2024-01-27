import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RouteService } from './route.service';
import { Role } from 'src/auth/decorator/role.decorator';
import { ROLE } from '@prisma/client';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @Role(ROLE.ADMIN)
  async createRoute(@Body() createRouteDto: CreateRouteDto) {
    return this.routeService.createRoute(createRouteDto);
  }

  @Put('/:id')
  @Role(ROLE.ADMIN)
  async updateRoute(
    @Body() updateRouteDto: UpdateRouteDto,
    @Param('id') id: string,
  ) {
    return this.routeService.updateRoute(+id, updateRouteDto);
  }

  @Get('/:id')
  async getDetailRoute(@Param('id') id: string) {
    return this.routeService.getDetailRoute(+id);
  }

  @Get()
  async getListRoute() {
    return this.routeService.getListRoute();
  }

  @Delete('/:id')
  @Role(ROLE.ADMIN)
  async deleteRoute(@Param('id') id: string) {
    return this.routeService.deleteRoute(+id);
  }
}

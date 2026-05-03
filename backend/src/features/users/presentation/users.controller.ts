import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import { UsersService } from '../application/users.service';
import type { AuthedRequest } from '../../../types';

@Controller('team')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: AuthedRequest) {
    return { users: await this.users.listFor(req.user) };
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: any) {
    return { user: await this.users.create(body) };
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() body: any, @Req() req: AuthedRequest) {
    return { user: await this.users.update(Number(id), body, req.user) };
  }
}

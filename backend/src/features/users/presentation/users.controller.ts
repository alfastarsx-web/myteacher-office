import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

  @Patch('me/status')
  @UseGuards(JwtAuthGuard)
  async updateOwnStatus(@Body() body: any, @Req() req: AuthedRequest) {
    return { user: await this.users.updateOwnStatus(req.user, String(body.status || 'Offline')) };
  }

  @Patch('me/profile')
  @UseGuards(JwtAuthGuard)
  async updateOwnProfile(@Body() body: any, @Req() req: AuthedRequest) {
    return { user: await this.users.updateOwnProfile(req.user, body) };
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() body: any, @Req() req: AuthedRequest) {
    return { user: await this.users.update(Number(id), body, req.user) };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.users.delete(Number(id), req.user);
  }
}

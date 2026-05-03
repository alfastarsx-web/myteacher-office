import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import type { AuthedRequest } from '../../../types';
import { TasksService } from '../application/tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  async list(@Req() req: AuthedRequest) {
    return { tasks: await this.tasks.list(req.user) };
  }

  @Post()
  async create(@Body() body: any, @Req() req: AuthedRequest) {
    return { task: await this.tasks.create(body, req.user) };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: AuthedRequest) {
    return { task: await this.tasks.update(Number(id), body, req.user) };
  }
}

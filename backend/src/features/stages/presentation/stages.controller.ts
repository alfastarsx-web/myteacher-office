import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { StagesService } from '../application/stages.service';

@Controller('api/stages')
export class StagesController {
  constructor(private readonly stages: StagesService) {}

  @Get()
  async list() {
    return { stages: await this.stages.list() };
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: any) {
    return { stage: await this.stages.create(body) };
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { StagesService } from '../application/stages.service';

@Controller('stages')
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

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    return { stage: await this.stages.update(id, body) };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    await this.stages.delete(id);
    return { ok: true };
  }
}

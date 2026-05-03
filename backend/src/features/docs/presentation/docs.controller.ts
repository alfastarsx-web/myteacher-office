import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import type { AuthedRequest } from '../../../types';
import { DocsService } from '../application/docs.service';

@Controller('docs')
export class DocsController {
  constructor(private readonly docs: DocsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    return { docs: await this.docs.list() };
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: any, @Req() req: AuthedRequest) {
    return { doc: await this.docs.create(body, req.user) };
  }
}

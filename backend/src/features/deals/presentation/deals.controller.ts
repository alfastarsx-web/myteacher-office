import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import type { AuthedRequest } from '../../../types';
import { DealsService } from '../application/deals.service';

@Controller('deals')
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private readonly deals: DealsService) {}

  @Get()
  async list(@Req() req: AuthedRequest) {
    return { deals: await this.deals.list(req.user) };
  }

  @Post()
  async create(@Body() body: any, @Req() req: AuthedRequest) {
    return { deal: await this.deals.create(body, req.user) };
  }

  @Post('import')
  async importRows(@Body() body: any, @Req() req: AuthedRequest) {
    return this.deals.importRows(body, req.user);
  }

  @Patch('bulk/owner')
  async bulkAssignOwner(@Body() body: any, @Req() req: AuthedRequest) {
    return { deals: await this.deals.bulkAssignOwner(body, req.user) };
  }

  @Delete('bulk')
  async bulkDelete(@Body() body: any, @Req() req: AuthedRequest) {
    return this.deals.bulkDelete(body, req.user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: AuthedRequest) {
    return { deal: await this.deals.update(Number(id), body, req.user) };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: AuthedRequest) {
    await this.deals.delete(Number(id), req.user);
    return { ok: true };
  }
}

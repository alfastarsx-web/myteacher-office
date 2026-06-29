import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import { PaymentAdjustmentsService } from '../application/payment-adjustments.service';
import type { AuthedRequest } from '../../../types';

@Controller('payment-adjustments')
export class PaymentAdjustmentsController {
  constructor(private readonly adjustments: PaymentAdjustmentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: AuthedRequest) {
    return { adjustments: await this.adjustments.listFor(req.user) };
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: any, @Req() req: AuthedRequest) {
    return { adjustment: await this.adjustments.create(body, req.user) };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    return this.adjustments.delete(Number(id));
  }
}

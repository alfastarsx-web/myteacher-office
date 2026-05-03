import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import type { AuthedRequest } from '../../../types';
import { DashboardService } from '../application/dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('summary')
  async summary(@Req() req: AuthedRequest) {
    return { summary: await this.dashboard.summary(req.user) };
  }
}

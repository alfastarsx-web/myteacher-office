import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { AiInsightsService } from '../application/ai-insights.service';

@Controller('ai-insights')
@UseGuards(AdminGuard)
export class AiInsightsController {
  constructor(private readonly aiInsights: AiInsightsService) {}

  @Get()
  async list() {
    return { insights: await this.aiInsights.list() };
  }

  @Post('generate')
  async generate() {
    return { insight: await this.aiInsights.generateDaily() };
  }
}

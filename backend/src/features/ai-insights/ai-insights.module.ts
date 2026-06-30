import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DealEntity } from '../deals/infrastructure/deal.entity';
import { TaskEntity } from '../tasks/infrastructure/task.entity';
import { AiInsightsService } from './application/ai-insights.service';
import { AiInsightEntity } from './infrastructure/ai-insight.entity';
import { AiInsightsController } from './presentation/ai-insights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AiInsightEntity, DealEntity, TaskEntity]), AuthModule],
  controllers: [AiInsightsController],
  providers: [AiInsightsService]
})
export class AiInsightsModule {}

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/database/typeorm.config';
import { AiInsightsModule } from './features/ai-insights/ai-insights.module';
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { DealsModule } from './features/deals/deals.module';
import { DocsModule } from './features/docs/docs.module';
import { IntegrationsModule } from './features/integrations/integrations.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { PaymentAdjustmentsModule } from './features/payment-adjustments/payment-adjustments.module';
import { StagesModule } from './features/stages/stages.module';
import { TasksModule } from './features/tasks/tasks.module';
import { UsersModule } from './features/users/users.module';
import { RootController } from './root.controller';
import { SeedModule } from './seed/seed.module';
import { SettingsModule } from './features/settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig()),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    StagesModule,
    DealsModule,
    IntegrationsModule,
    TasksModule,
    DocsModule,
    DashboardModule,
    NotificationsModule,
    PaymentAdjustmentsModule,
    AiInsightsModule,
    SettingsModule,
    SeedModule
  ],
  controllers: [RootController]
})
export class AppModule {}

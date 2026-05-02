import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DealsModule } from '../deals/deals.module';
import { UsersModule } from '../users/users.module';
import { DashboardService } from './application/dashboard.service';
import { DashboardController } from './presentation/dashboard.controller';

@Module({
  imports: [AuthModule, DealsModule, UsersModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}

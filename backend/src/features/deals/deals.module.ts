import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DealsService } from './application/deals.service';
import { DealEntity } from './infrastructure/deal.entity';
import { DealsController } from './presentation/deals.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([DealEntity]), AuthModule, NotificationsModule, UsersModule],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService]
})
export class DealsModule {}

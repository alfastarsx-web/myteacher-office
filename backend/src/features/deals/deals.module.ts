import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DealsService } from './application/deals.service';
import { DealEntity } from './infrastructure/deal.entity';
import { DealsController } from './presentation/deals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DealEntity]), AuthModule],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService]
})
export class DealsModule {}

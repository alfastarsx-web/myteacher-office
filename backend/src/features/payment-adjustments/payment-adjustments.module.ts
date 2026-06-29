import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PaymentAdjustmentsService } from './application/payment-adjustments.service';
import { PaymentAdjustmentEntity } from './infrastructure/payment-adjustment.entity';
import { PaymentAdjustmentsController } from './presentation/payment-adjustments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentAdjustmentEntity]), AuthModule],
  controllers: [PaymentAdjustmentsController],
  providers: [PaymentAdjustmentsService],
  exports: [PaymentAdjustmentsService]
})
export class PaymentAdjustmentsModule {}

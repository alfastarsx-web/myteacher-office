import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DealEntity } from '../deals/infrastructure/deal.entity';
import { StagesService } from './application/stages.service';
import { StageEntity } from './infrastructure/stage.entity';
import { StagesController } from './presentation/stages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StageEntity, DealEntity]), AuthModule],
  controllers: [StagesController],
  providers: [StagesService],
  exports: [StagesService]
})
export class StagesModule {}

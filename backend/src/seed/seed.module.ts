import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '../common/crypto/password.service';
import { DealEntity } from '../features/deals/infrastructure/deal.entity';
import { DocEntity } from '../features/docs/infrastructure/doc.entity';
import { StageEntity } from '../features/stages/infrastructure/stage.entity';
import { TaskEntity } from '../features/tasks/infrastructure/task.entity';
import { UserEntity } from '../features/users/infrastructure/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, StageEntity, DealEntity, TaskEntity, DocEntity])],
  providers: [SeedService, PasswordService]
})
export class SeedModule {}

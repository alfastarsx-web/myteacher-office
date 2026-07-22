import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TaskEntity } from './infrastructure/task.entity';
import { DealEntity } from '../deals/infrastructure/deal.entity';
import { TasksService } from './application/tasks.service';
import { TasksController } from './presentation/tasks.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, DealEntity]), AuthModule, NotificationsModule, UsersModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule {}

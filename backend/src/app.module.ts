import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/database/typeorm.config';
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { DealsModule } from './features/deals/deals.module';
import { DocsModule } from './features/docs/docs.module';
import { StagesModule } from './features/stages/stages.module';
import { TasksModule } from './features/tasks/tasks.module';
import { UsersModule } from './features/users/users.module';
import { RootController } from './root.controller';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig()),
    AuthModule,
    UsersModule,
    StagesModule,
    DealsModule,
    TasksModule,
    DocsModule,
    DashboardModule,
    SeedModule
  ],
  controllers: [RootController]
})
export class AppModule {}

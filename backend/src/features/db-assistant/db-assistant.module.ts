import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DbAssistantMessageEntity } from './infrastructure/db-assistant-message.entity';
import { DbAssistantSessionEntity } from './infrastructure/db-assistant-session.entity';
import { DbAssistantService } from './application/db-assistant.service';
import { DbAssistantController } from './presentation/db-assistant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DbAssistantSessionEntity, DbAssistantMessageEntity]), AuthModule],
  controllers: [DbAssistantController],
  providers: [DbAssistantService]
})
export class DbAssistantModule {}

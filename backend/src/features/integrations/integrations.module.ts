import { Module } from '@nestjs/common';
import { DealsModule } from '../deals/deals.module';
import { UsersModule } from '../users/users.module';
import { IntegrationsController } from './presentation/integrations.controller';

@Module({
  imports: [DealsModule, UsersModule],
  controllers: [IntegrationsController]
})
export class IntegrationsModule {}

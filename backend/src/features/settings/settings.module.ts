import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SettingsService } from './application/settings.service';
import { SettingEntity } from './infrastructure/setting.entity';
import { SettingsController } from './presentation/settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity]), AuthModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService]
})
export class SettingsModule {}

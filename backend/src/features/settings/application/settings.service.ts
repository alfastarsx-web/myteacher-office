import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingEntity } from '../infrastructure/setting.entity';

export const AUTO_ASSIGN_LEADS_KEY = 'autoAssignLeads';
export const AUTO_ASSIGN_CURSOR_KEY = 'autoAssignCursor';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingEntity) private readonly settings: Repository<SettingEntity>
  ) {}

  async get(key: string): Promise<string | null> {
    const row = await this.settings.findOne({ where: { key } });
    return row ? row.value : null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.settings.save({ key, value });
  }

  async getBool(key: string): Promise<boolean> {
    return (await this.get(key)) === 'true';
  }

  async publicSettings() {
    return { autoAssignLeads: await this.getBool(AUTO_ASSIGN_LEADS_KEY) };
  }
}

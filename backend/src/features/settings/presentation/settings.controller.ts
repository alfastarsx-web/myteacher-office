import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import { AUTO_ASSIGN_LEADS_KEY, SettingsService } from '../application/settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async get() {
    return { settings: await this.settings.publicSettings() };
  }

  @Patch()
  @UseGuards(AdminGuard)
  async update(@Body() body: any) {
    if (body.autoAssignLeads !== undefined) {
      await this.settings.set(AUTO_ASSIGN_LEADS_KEY, body.autoAssignLeads ? 'true' : 'false');
    }
    return { settings: await this.settings.publicSettings() };
  }
}

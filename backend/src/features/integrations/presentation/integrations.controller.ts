import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { DealsService } from '../../deals/application/deals.service';
import { UsersService } from '../../users/application/users.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly deals: DealsService,
    private readonly users: UsersService
  ) {}

  @Post('n8n/leads')
  async createLead(@Body() body: any, @Headers('x-webhook-secret') secret: string) {
    const expected = process.env.N8N_WEBHOOK_SECRET || '';
    if (!expected || secret !== expected) throw new UnauthorizedException('Webhook token noto‘g‘ri');

    const admin = await this.users.findFirstAdmin();
    if (!admin) throw new UnauthorizedException('Admin topilmadi');

    const deal = await this.deals.create({
      customerName: body.customerName || body.name || body.mijoz || body.ism,
      dealName: body.dealName || body.contract || body.shartnoma || body.kurs,
      phone: body.phone || body.telefon,
      phones: body.phones,
      stageId: body.stageId || body.stage || 'yangi',
      price: body.price || body.summa || 0,
      note: body.note || body.izoh || '',
      adSource: body.adSource || body.reklama || body.source || '',
      registeredAt: body.registeredAt || body.vaqt || body.date || new Date().toISOString(),
      age: body.age || body.yosh || '',
      learningGoal: body.learningGoal || body.maqsad || '',
      leadChannel: body.leadChannel || body.channel || body.kanal || body.source || '',
      ownerId: body.ownerId || null
    }, admin);

    return { ok: true, deal };
  }
}

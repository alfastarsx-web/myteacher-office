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

    // Reklama kanallaridan bir xil lid bir necha marta kelishi odatiy hol. Webhook uchun
    // xato qaytarish n8n'da qayta urinishlarga sabab bo'ladi, shuning uchun mavjud lidni
    // shunchaki qaytaramiz — yangi dublikat yaratilmaydi.
    const phones = [...(Array.isArray(body.phones) ? body.phones : []), body.phone || body.telefon]
      .map((item: any) => String(item || '').trim())
      .filter(Boolean);
    const duplicate = await this.deals.findDuplicateByPhone(phones);
    if (duplicate) return { ok: true, duplicate: true, deal: duplicate };

    let deal = await this.deals.create({
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

    deal = await this.deals.autoAssignToOnlineOperator(deal);

    return { ok: true, deal };
  }
}

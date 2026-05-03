import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PasswordService } from '../../../common/crypto/password.service';
import { UserRole } from '../../users/domain/user-role.enum';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { DealEntity } from '../infrastructure/deal.entity';

const AGREED_STAGE_ID = 'sotib_olishga_rozi';
const WON_STAGE_ID = 'yutgan';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(DealEntity) private readonly deals: Repository<DealEntity>,
    private readonly passwords: PasswordService
  ) {}

  canSee(user: UserEntity, deal: DealEntity) {
    return user.role === UserRole.Admin || user.permissions?.all === true || deal.ownerId === user.id;
  }

  async list(user: UserEntity) {
    this.assertCrmAccess(user);
    if (user.role === UserRole.Admin || user.permissions?.all === true) return this.deals.find({ order: { id: 'ASC' } });
    return this.deals.createQueryBuilder('deal')
      .where('deal.ownerId = :id', { id: user.id })
      .orderBy('deal.id', 'ASC')
      .getMany();
  }

  async create(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const customerName = String(body.customerName || '').trim();
    if (!customerName) throw new BadRequestException('Mijoz nomi kerak');
    const phones = this.normalizePhones(body);
    this.assertStageRules(body.stageId || 'yangi', Number(body.price || 0), body, user, null);
    const deal = this.deals.create({
      customerName,
      dealName: String(body.dealName || '').trim(),
      phone: phones[0] || '',
      phones,
      stageId: body.stageId || 'yangi',
      price: Number(body.price || 0),
      note: String(body.note || ''),
      adSource: String(body.adSource || ''),
      registeredAt: String(body.registeredAt || ''),
      age: body.age === null || body.age === undefined || body.age === '' ? null : Number(body.age),
      learningGoal: String(body.learningGoal || ''),
      leadChannel: String(body.leadChannel || ''),
      ownerId: user.role === UserRole.Admin ? this.parseOwnerId(body.ownerId) : user.id,
      createdBy: user.id
    });
    return this.deals.save(deal);
  }

  async importRows(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const rows = Array.isArray(body.rows) ? body.rows : [];
    if (!rows.length) throw new BadRequestException('Import uchun qatorlar topilmadi');
    const imported: DealEntity[] = [];
    for (const row of rows) {
      const customerName = String(row.customerName || row.name || row.mijoz || '').trim();
      if (!customerName) continue;
      imported.push(await this.create({
        customerName,
        dealName: String(row.dealName || row.contract || row.shartnoma || '').trim(),
        phone: row.phone || row.telefon || '',
        phones: row.phones,
        stageId: row.stageId || row.stage || 'yangi',
        price: row.price || row.summa || 0,
        note: row.note || row.izoh || '',
        adSource: row.adSource || row.reklama || row['qaysi reklamadan kelgan'] || '',
        registeredAt: row.registeredAt || row['ro‘yxatdan o‘tgan vaqti'] || row['royxatdan otgan vaqti'] || row.vaqt || '',
        age: row.age || row.yosh || row.yoshi || '',
        learningGoal: row.learningGoal || row.maqsad || row['o‘rganishdan maqsadi'] || row['organishdan maqsadi'] || '',
        leadChannel: row.leadChannel || row.channel || row.kanal || row['qayerdan keldi'] || '',
        ownerId: row.ownerId || null
      }, user));
    }
    return imported;
  }

  async update(id: number, body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const deal = await this.deals.findOne({ where: { id } });
    if (!deal || !this.canSee(user, deal)) throw new NotFoundException('Shartnoma topilmadi');
    const nextStageId = body.stageId !== undefined ? String(body.stageId) : deal.stageId;
    const nextPrice = body.price !== undefined ? Number(body.price || 0) : Number(deal.price || 0);
    this.assertStageRules(nextStageId, nextPrice, body, user, deal);
    ['customerName', 'dealName', 'stageId', 'note', 'adSource', 'registeredAt', 'learningGoal', 'leadChannel'].forEach(key => {
      if (body[key] !== undefined) deal[key] = String(body[key]);
    });
    if (body.age !== undefined) deal.age = body.age === null || body.age === '' ? null : Number(body.age);
    if (body.phone !== undefined || body.phones !== undefined) {
      const phones = this.normalizePhones(body);
      deal.phone = phones[0] || '';
      deal.phones = phones;
    }
    if (body.price !== undefined) deal.price = Number(body.price || 0);
    if (body.ownerId !== undefined && user.role === UserRole.Admin) deal.ownerId = this.parseOwnerId(body.ownerId);
    return this.deals.save(deal);
  }

  async bulkAssignOwner(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    if (user.role !== UserRole.Admin) throw new ForbiddenException('Faqat Admin shartnomalarni taqsimlay oladi');
    const ids = [...new Set((Array.isArray(body.ids) ? body.ids : [])
      .map(item => Number(item))
      .filter(id => Number.isInteger(id) && id > 0))];
    if (!ids.length) throw new BadRequestException('Shartnomalarni tanlang');
    const ownerId = this.parseOwnerId(body.ownerId);
    const rows = await this.deals.find({ where: { id: In(ids) }, order: { id: 'ASC' } });
    if (!rows.length) throw new NotFoundException('Shartnomalar topilmadi');
    rows.forEach(deal => { deal.ownerId = ownerId; });
    return this.deals.save(rows);
  }

  async delete(id: number, user: UserEntity) {
    this.assertCrmAccess(user);
    if (user.role !== UserRole.Admin) throw new ForbiddenException('Faqat Admin shartnomani o‘chira oladi');
    const deal = await this.deals.findOne({ where: { id } });
    if (!deal || !this.canSee(user, deal)) throw new NotFoundException('Shartnoma topilmadi');
    await this.deals.delete(id);
  }

  private normalizePhones(body: any) {
    return [...new Set([...(Array.isArray(body.phones) ? body.phones : []), body.phone]
      .map(item => String(item || '').trim())
      .filter(Boolean))]
      .slice(0, 3);
  }

  private parseOwnerId(value: any) {
    if (value === null || value === undefined || value === '') return null;
    return Number(value);
  }

  private assertCrmAccess(user: UserEntity) {
    if (user.role !== UserRole.Admin && user.permissions?.crm === false) {
      throw new ForbiddenException('CRM ruxsati yopilgan');
    }
  }

  private assertStageRules(stageId: string, price: number, body: any, user: UserEntity, deal: DealEntity | null) {
    if ([AGREED_STAGE_ID, WON_STAGE_ID].includes(stageId) && price <= 0) {
      throw new BadRequestException('Bu bosqichga o‘tish uchun shartnoma summasini kiriting');
    }
    const isNewWon = stageId === WON_STAGE_ID && deal?.stageId !== WON_STAGE_ID;
    if (isNewWon) {
      const password = String(body.closePassword || '');
      if (!password || !this.passwords.verify(password, user.passwordHash)) {
        throw new ForbiddenException('Muvaffaqiyatli bosqichga o‘tish uchun parol noto‘g‘ri');
      }
    }
  }
}

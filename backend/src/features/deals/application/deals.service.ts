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
      ownerId: user.role === UserRole.Admin ? this.parseOwnerId(body.ownerId) : user.id,
      createdBy: user.id
    });
    return this.deals.save(deal);
  }

  async update(id: number, body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const deal = await this.deals.findOne({ where: { id } });
    if (!deal || !this.canSee(user, deal)) throw new NotFoundException('Shartnoma topilmadi');
    const nextStageId = body.stageId !== undefined ? String(body.stageId) : deal.stageId;
    const nextPrice = body.price !== undefined ? Number(body.price || 0) : Number(deal.price || 0);
    this.assertStageRules(nextStageId, nextPrice, body, user, deal);
    ['customerName', 'dealName', 'stageId', 'note'].forEach(key => {
      if (body[key] !== undefined) deal[key] = String(body[key]);
    });
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
    const deal = await this.deals.findOne({ where: { id } });
    if (!deal || !this.canSee(user, deal)) throw new NotFoundException('Shartnoma topilmadi');
    await this.deals.delete(id);
  }

  private normalizePhones(body: any) {
    return [...new Set([...(Array.isArray(body.phones) ? body.phones : []), body.phone]
      .map(item => String(item || '').trim())
      .filter(Boolean))];
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

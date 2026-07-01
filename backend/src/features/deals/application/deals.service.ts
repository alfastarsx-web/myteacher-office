import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PasswordService } from '../../../common/crypto/password.service';
import { UserRole } from '../../users/domain/user-role.enum';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { UsersService } from '../../users/application/users.service';
import { DealEntity } from '../infrastructure/deal.entity';
import { NotificationsGateway } from '../../notifications/notifications.gateway';
import { TasksService } from '../../tasks/application/tasks.service';
import { TelegramService } from '../../../common/telegram/telegram.service';

const AGREED_STAGE_ID = 'sotib_olishga_rozi';
const WON_STAGE_ID = 'yutgan';
const LOST_STAGE_ID = 'yutqazilgan';
const BULK_BLOCKED_STAGE_IDS = [AGREED_STAGE_ID, WON_STAGE_ID];
const OPERATOR_QUAL_STAGE_ID = 'op_malakali';
const VALID_PAYMENT_TYPES = ['naqd', 'karta', 'otkazma'];
const OPERATOR_STAGE_IDS = ['op_yangi', 'op_qayta', 'op_malakali', 'op_yutqazilgan'];

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(DealEntity) private readonly deals: Repository<DealEntity>,
    private readonly passwords: PasswordService,
    private readonly notifications: NotificationsGateway,
    private readonly users: UsersService,
    private readonly tasks: TasksService,
    private readonly telegram: TelegramService
  ) {}

  canSee(user: UserEntity, deal: DealEntity) {
    return user.role === UserRole.Admin || user.permissions?.all === true || deal.ownerId === user.id || (user.role === UserRole.Operator && deal.operatorId === user.id);
  }

  async list(user: UserEntity) {
    this.assertCrmAccess(user);
    if (user.role === UserRole.Admin || user.permissions?.all === true) return this.deals.find({ order: { id: 'ASC' } });
    if (user.role === UserRole.Operator) {
      return this.deals.createQueryBuilder('deal')
        .where('deal.operatorId = :id', { id: user.id })
        .orderBy('deal.id', 'ASC')
        .getMany();
    }
    // Menejer: o'ziga biriktirilgan YOKI hali biriktirilmagan (operator tomonidan malakali qilingan) lidlarni ko'radi
    return this.deals.createQueryBuilder('deal')
      .where('(deal.ownerId = :id OR (deal.ownerId IS NULL AND deal.stageId NOT IN (:...opStages)))', {
        id: user.id,
        opStages: OPERATOR_STAGE_IDS,
      })
      .orderBy('deal.id', 'ASC')
      .getMany();
  }

  async create(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const customerName = String(body.customerName || '').trim();
    if (!customerName) throw new BadRequestException('Mijoz nomi kerak');
    const phones = this.normalizePhones(body);
    // Operator yaratgan/import qilgan lid (stageId ko'rsatilmagan bo'lsa) operator voronkasining
    // "Yangi" bosqichiga (op_yangi) tushishi kerak, menejer voronkasining 'yangi'siga emas —
    // aks holda lid hech qaysi kanbanda to'g'ri ko'rinmaydi va "Bosqich" deb noaniq belgilanadi.
    const defaultStageId = user.role === UserRole.Operator ? 'op_yangi' : 'yangi';
    this.assertStageRules(body.stageId || defaultStageId, this.parsePrice(body.price), body, user, null);
    const deal = this.deals.create({
      customerName,
      dealName: String(body.dealName || '').trim(),
      phone: phones[0] || '',
      phones,
      stageId: body.stageId || defaultStageId,
      price: this.parsePrice(body.price),
      note: String(body.note || ''),
      adSource: String(body.adSource || ''),
      registeredAt: String(body.registeredAt || ''),
      age: body.age === null || body.age === undefined || body.age === '' ? null : Number(body.age),
      learningGoal: String(body.learningGoal || ''),
      leadChannel: String(body.leadChannel || ''),
      ownerId: user.role === UserRole.Admin ? this.parseOwnerId(body.ownerId) : user.role === UserRole.Operator ? this.parseOwnerId(body.ownerId) : user.id,
      operatorId: user.role === UserRole.Operator ? user.id : (body.operatorId ? Number(body.operatorId) : null),
      appInstalled: Boolean(body.appInstalled || false),
      appInstalledAt: body.appInstalled ? new Date().toISOString() : null,
      qualAt: body.qualAt || null,
      sentToManager: Boolean(body.sentToManager || false),
      courseDuration: Number.isInteger(Number(body.courseDuration)) && Number(body.courseDuration) >= 1 && Number(body.courseDuration) <= 6 ? Number(body.courseDuration) : null,
      paymentType: VALID_PAYMENT_TYPES.includes(body.paymentType) ? body.paymentType : null,
      createdBy: user.id
    });
    return this.deals.save(deal);
  }

  async importRows(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const rows = Array.isArray(body.rows) ? body.rows : [];
    if (!rows.length) throw new BadRequestException('Import uchun qatorlar topilmadi');
    const imported: DealEntity[] = [];
    let skipped = 0;
    for (const row of rows) {
      try {
        const customerName = String(row.customerName || row.name || row.mijoz || '').trim();
        if (!customerName) {
          skipped++;
          continue;
        }
        imported.push(await this.create({
          customerName,
          dealName: String(row.dealName || row.contract || row.shartnoma || '').trim(),
          phone: row.phone || row.telefon || '',
          phones: row.phones,
          stageId: row.stageId || row.stage || (user.role === UserRole.Operator ? 'op_yangi' : 'yangi'),
          price: row.price || row.summa || 0,
          note: row.note || row.izoh || '',
          adSource: row.adSource || row.reklama || row['qaysi reklamadan kelgan'] || '',
          registeredAt: row.registeredAt || row['ro‘yxatdan o‘tgan vaqti'] || row['royxatdan otgan vaqti'] || row.vaqt || '',
          age: row.age || row.yosh || row.yoshi || '',
          learningGoal: row.learningGoal || row.maqsad || row['o‘rganishdan maqsadi'] || row['organishdan maqsadi'] || '',
          leadChannel: row.leadChannel || row.channel || row.kanal || row['qayerdan keldi'] || '',
          ownerId: row.ownerId || null
        }, user));
      } catch {
        skipped++;
      }
    }
    return { deals: imported, imported: imported.length, skipped };
  }

  async update(id: number, body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const deal = await this.deals.findOne({ where: { id } });
    if (!deal || !this.canSee(user, deal)) throw new NotFoundException('Shartnoma topilmadi');
    const prevStageId = deal.stageId;
    const prevCommentsLength = deal.comments?.length || 0;
    const nextStageId = body.stageId !== undefined ? String(body.stageId) : deal.stageId;
    const nextPrice = body.price !== undefined ? this.parsePrice(body.price) : this.parsePrice(deal.price);
    this.assertStageRules(nextStageId, nextPrice, body, user, deal);
    if (nextStageId !== prevStageId && user.role !== UserRole.Admin && user.permissions?.all !== true) {
      await this.assertStageChangeJustified(deal, body, prevCommentsLength);
    }
    ['customerName', 'dealName', 'stageId', 'note', 'adSource', 'registeredAt', 'learningGoal', 'leadChannel'].forEach(key => {
      if (body[key] !== undefined) deal[key] = String(body[key]);
    });
    if (Array.isArray(body.comments)) deal.comments = body.comments;
    // Lid "Yutqazilgan" bo'lganda, qaysi bosqichdan kelib yutqazilganini saqlaymiz — voronka tahlili uchun
    if (nextStageId === LOST_STAGE_ID && prevStageId !== LOST_STAGE_ID) {
      deal.lostFromStage = prevStageId;
    }
    // Bosqich o'zgarganda deal owneriga xabar
    if (body.stageId !== undefined && body.stageId !== prevStageId && deal.ownerId && deal.ownerId !== user.id) {
      this.notifications.sendToUser(deal.ownerId, {
        type: 'stage_changed',
        title: "Shartnoma bosqichi o'zgardi",
        body: `"${deal.customerName}" yangi bosqichga o'tkazildi: ${body.stageId}`,
        dealId: deal.id,
        fromUserId: user.id,
        userId: deal.ownerId
      }).catch(() => {});
    }
    // Comment qo'shilganda
    if (body.comments !== undefined && Array.isArray(body.comments) && body.comments.length > prevCommentsLength && deal.ownerId && deal.ownerId !== user.id) {
      this.notifications.sendToUser(deal.ownerId, {
        type: 'comment_added',
        title: "Yangi izoh qo'shildi",
        body: `"${deal.customerName}" shartnomasiga yangi izoh qo'shildi`,
        dealId: deal.id,
        fromUserId: user.id,
        userId: deal.ownerId
      }).catch(() => {});
    }
    if (body.age !== undefined) deal.age = body.age === null || body.age === '' ? null : Number(body.age);
    if (body.phone !== undefined || body.phones !== undefined) {
      const phones = this.normalizePhones(body);
      deal.phone = phones[0] || '';
      deal.phones = phones;
    }
    if (body.price !== undefined) deal.price = this.parsePrice(body.price);
    if (body.ownerId !== undefined && user.role === UserRole.Admin) {
      const prevOwnerId = deal.ownerId;
      deal.ownerId = this.parseOwnerId(body.ownerId);
      // Deal yangi menejerga biriktirildi — unga xabar yuboramiz
      if (deal.ownerId && deal.ownerId !== prevOwnerId) {
        this.notifications.sendToUser(deal.ownerId, {
          type: 'deal_assigned',
          title: 'Yangi shartnoma biriktirildi',
          body: `"${deal.customerName}" — siz uchun yangi shartnoma biriktirildi`,
          dealId: deal.id,
          fromUserId: user.id,
          userId: deal.ownerId
        }).catch(() => {});
      }
    }
    if (body.operatorId !== undefined) deal.operatorId = body.operatorId ? Number(body.operatorId) : null;
    if (body.appInstalled !== undefined) {
      const nextAppInstalled = Boolean(body.appInstalled);
      if (nextAppInstalled && !deal.appInstalled) deal.appInstalledAt = new Date().toISOString();
      deal.appInstalled = nextAppInstalled;
    }
    if (body.qualAt !== undefined) deal.qualAt = body.qualAt || null;
    if (body.fullCall !== undefined) {
      if (user.role !== UserRole.Manager) throw new ForbiddenException('Faqat menejer full call belgisini qo‘ya oladi');
      const nextFullCall = Boolean(body.fullCall);
      if (nextFullCall && !deal.fullCall) deal.fullCallAt = new Date().toISOString();
      deal.fullCall = nextFullCall;
    }
    if (body.sentToManager !== undefined) deal.sentToManager = Boolean(body.sentToManager);
    if (body.courseDuration !== undefined) {
      const duration = Number(body.courseDuration);
      deal.courseDuration = Number.isInteger(duration) && duration >= 1 && duration <= 6 ? duration : null;
    }
    if (body.paymentType !== undefined) {
      deal.paymentType = VALID_PAYMENT_TYPES.includes(body.paymentType) ? body.paymentType : null;
    }
    if (nextStageId === OPERATOR_QUAL_STAGE_ID && prevStageId !== OPERATOR_QUAL_STAGE_ID && !deal.sentToManager) {
      await this.handoffQualifiedLead(deal, user);
    }
    if (nextStageId === WON_STAGE_ID && prevStageId !== WON_STAGE_ID) {
      const managerName = user.name || user.email || 'Menejer';
      const price = deal.price ? `${Number(deal.price).toLocaleString('uz-UZ')} so’m` : 'narx ko’rsatilmagan';
      const phone = deal.phone || (deal.phones?.[0]) || '—';
      this.telegram.sendMessage(
        '🎉 <b>Yangi to’lov!</b>\n\n' +
        `👤 Mijoz: <b>${deal.customerName}</b>\n` +
        `📞 Tel: ${phone}\n` +
        `💰 Summa: <b>${price}</b>\n` +
        `👨‍💼 Menejer: ${managerName}`
      ).catch(() => {});
    }
    return this.deals.save(deal);
  }

  // Operator lidni "Malakali" qilganda, menejer voronkasiga ownerId=null bilan ko'chiramiz.
  // Barcha menejerlar ko'radi, admin keyin biriktirib qo'yadi.
  private async handoffQualifiedLead(deal: DealEntity, user: UserEntity) {
    deal.sentToManager = true;
    deal.qualAt = new Date().toISOString();
    const handoff = this.deals.create({
      customerName: deal.customerName,
      dealName: deal.dealName || deal.customerName,
      phone: deal.phone,
      phones: deal.phones,
      stageId: 'malakali',
      price: 0,
      note: 'Operator tomonidan malakali qilindi',
      adSource: deal.adSource,
      registeredAt: deal.registeredAt,
      learningGoal: deal.learningGoal,
      leadChannel: deal.leadChannel,
      qualAt: deal.qualAt,
      ownerId: null,
      operatorId: deal.operatorId || user.id,
      createdBy: user.id
    });
    await this.deals.save(handoff);
  }

  async bulkAssignOwner(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    if (user.role !== UserRole.Admin) throw new ForbiddenException('Faqat Admin shartnomalarni taqsimlay oladi');
    const ids = this.parseIds(body.ids);
    if (!ids.length) throw new BadRequestException('Shartnomalarni tanlang');
    const rows = await this.deals.find({ where: { id: In(ids) }, order: { id: 'ASC' } });
    if (!rows.length) throw new NotFoundException('Shartnomalar topilmadi');

    // Operatorga biriktirish
    if (body.operatorId !== undefined) {
      const operatorId = body.operatorId ? Number(body.operatorId) : null;
      rows.forEach(deal => {
        deal.operatorId = operatorId;
        deal.ownerId = null; // Operatorga o'tkazilganda menejer biriktirilmagan bo'ladi
        deal.stageId = 'op_yangi'; // Operator voronkasiga yangi sifatida kiradi
      });
    } else {
      // Menejerga biriktirish
      const ownerId = this.parseOwnerId(body.ownerId);
      rows.forEach(deal => { deal.ownerId = ownerId; });
    }

    const saved = await this.deals.save(rows);
    return { deals: saved };
  }

  async bulkAssignStage(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    if (user.role !== UserRole.Admin) throw new ForbiddenException('Faqat Admin shartnomalar bosqichini o‘zgartira oladi');
    const ids = this.parseIds(body.ids);
    if (!ids.length) throw new BadRequestException('Shartnomalarni tanlang');
    const stageId = String(body.stageId || '').trim();
    if (!stageId) throw new BadRequestException('Bosqichni tanlang');
    if (BULK_BLOCKED_STAGE_IDS.includes(stageId)) {
      throw new BadRequestException('Bu bosqich massoviy o‘zgartirish uchun yopiq');
    }
    const rows = await this.deals.find({ where: { id: In(ids) }, order: { id: 'ASC' } });
    if (!rows.length) throw new NotFoundException('Shartnomalar topilmadi');
    rows.forEach(deal => { deal.stageId = stageId; });
    return this.deals.save(rows);
  }

  async bulkDelete(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    if (user.role !== UserRole.Admin) throw new ForbiddenException('Faqat Admin shartnomalarni o‘chira oladi');
    const ids = this.parseIds(body.ids);
    if (!ids.length) throw new BadRequestException('Shartnomalarni tanlang');
    const rows = await this.deals.find({ where: { id: In(ids) }, order: { id: 'ASC' } });
    if (!rows.length) throw new NotFoundException('Shartnomalar topilmadi');
    await this.deals.delete(rows.map(row => row.id));
    return { deleted: rows.length };
  }

  // Bir martalik tuzatish: operatorga tegishli (operatorId bor, ownerId yo'q), lekin stageId operator
  // voronkasi (op_yangi/op_qayta/op_malakali/op_yutqazilgan) ga mos kelmaydigan lidlarni "op_yangi"ga
  // ko'chiradi. Eski import bug'i tufayli import faylidagi "Bosqich" ustunidagi ixtiyoriy matn
  // (masalan "Yangi") to'g'ridan-to'g'ri stageId sifatida yozilib qolgan edi.
  async fixMisplacedOperatorLeads(user: UserEntity) {
    if (user.role !== UserRole.Admin) throw new ForbiddenException('Faqat Admin bu tuzatishni ishga tushira oladi');
    const rows = await this.deals.createQueryBuilder('deal')
      .where('deal.operatorId IS NOT NULL')
      .andWhere('deal.ownerId IS NULL')
      .andWhere('deal.stageId NOT IN (:...stageIds)', { stageIds: OPERATOR_STAGE_IDS })
      .getMany();
    if (!rows.length) return { fixed: 0 };
    rows.forEach(deal => { deal.stageId = 'op_yangi'; });
    await this.deals.save(rows);
    return { fixed: rows.length, ids: rows.map(row => row.id) };
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

  private parsePrice(value: any) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private parseIds(value: any) {
    return [...new Set((Array.isArray(value) ? value : [])
      .map(item => Number(item))
      .filter(id => Number.isInteger(id) && id > 0))];
  }

  private assertCrmAccess(user: UserEntity) {
    if (user.role !== UserRole.Admin && user.permissions?.crm === false) {
      throw new ForbiddenException('CRM ruxsati yopilgan');
    }
  }

  // Bosqich o'zgarganda, kamida 4 so'zli yangi izoh yoki ochiq vazifa talab qilamiz —
  // aks holda lidlar "k", "ochiq" kabi mazmunsiz belgilar bilan siljib, yo'qotish sababi hech qachon yozilmay qoladi.
  private async assertStageChangeJustified(deal: DealEntity, body: any, prevCommentsLength: number) {
    if (await this.tasks.hasOpenTaskForDeal(deal.id)) return;
    const comments = Array.isArray(body.comments) ? body.comments : null;
    if (comments && comments.length > prevCommentsLength) {
      const text = String(comments[comments.length - 1]?.text || '').trim();
      if (text.split(/\s+/).filter(Boolean).length >= 4) return;
    }
    throw new BadRequestException('Bosqichni o‘zgartirish uchun kamida 4 so‘zdan iborat izoh yozing yoki ochiq vazifa qo‘ying');
  }

  private assertStageRules(stageId: string, price: number, body: any, user: UserEntity, deal: DealEntity | null) {
    if ([AGREED_STAGE_ID, WON_STAGE_ID].includes(stageId) && (!Number.isFinite(price) || price <= 0)) {
      throw new BadRequestException('Bu bosqichga o‘tish uchun shartnoma summasini kiriting');
    }
    const isNewWon = stageId === WON_STAGE_ID && deal?.stageId !== WON_STAGE_ID;
    if (isNewWon) {
      const password = String(body.closePassword || '');
      if (!password || !this.passwords.verify(password, user.passwordHash)) {
        throw new ForbiddenException('Muvaffaqiyatli bosqichga o‘tish uchun parol noto‘g‘ri');
      }
      const courseDuration = Number(body.courseDuration);
      if (!Number.isInteger(courseDuration) || courseDuration < 1 || courseDuration > 6) {
        throw new BadRequestException('Kurs muddatini (1-6 oy) tanlang');
      }
      if (!VALID_PAYMENT_TYPES.includes(body.paymentType)) {
        throw new BadRequestException('To‘lov turini tanlang');
      }
    }
  }
}

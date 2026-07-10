import { BadRequestException, ForbiddenException, Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
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
import { AUTO_ASSIGN_CURSOR_KEY, AUTO_ASSIGN_LEADS_KEY, SettingsService } from '../../settings/application/settings.service';

const AGREED_STAGE_ID = 'sotib_olishga_rozi';
const WON_STAGE_ID = 'yutgan';
const PARTIAL_STAGE_ID = 'qisman';
const LOST_STAGE_ID = 'yutqazilgan';
const BULK_BLOCKED_STAGE_IDS = [AGREED_STAGE_ID, PARTIAL_STAGE_ID, WON_STAGE_ID];
const OPERATOR_QUAL_STAGE_ID = 'op_malakali';
const VALID_PAYMENT_TYPES = ['naqd', 'karta', 'otkazma'];
const OPERATOR_STAGE_IDS = ['op_yangi', 'op_qayta', 'op_malakali', 'op_yutqazilgan'];

@Injectable()
export class DealsService implements OnApplicationBootstrap {
  // Boot paytida mavjud dublikatlarni bir marta tozalaymiz — eski ma'lumotdagi
  // "bitta lid ikki menejerda" holatlarini birlashtiradi (idempotent).
  async onApplicationBootstrap() {
    try { await this.consolidateDuplicateLeads(); } catch (e) { console.warn('consolidateDuplicateLeads:', (e as Error).message); }
  }

  constructor(
    @InjectRepository(DealEntity) private readonly deals: Repository<DealEntity>,
    private readonly passwords: PasswordService,
    private readonly notifications: NotificationsGateway,
    private readonly users: UsersService,
    private readonly tasks: TasksService,
    private readonly telegram: TelegramService,
    private readonly settings: SettingsService
  ) {}

  // Avtomatik taqsimlash yoqilgan bo'lsa, hali biriktirilmagan yangi lidni navbatdagi
  // "Online" operatorga round-robin usulida biriktiradi va operator voronkasiga o'tkazadi.
  async autoAssignToOnlineOperator(deal: DealEntity): Promise<DealEntity> {
    if (deal.ownerId || deal.operatorId) return deal;
    const enabled = await this.settings.getBool(AUTO_ASSIGN_LEADS_KEY);
    if (!enabled) return deal;
    const operators = await this.users.findOnlineOperators();
    if (!operators.length) return deal;
    const cursor = Number(await this.settings.get(AUTO_ASSIGN_CURSOR_KEY)) || 0;
    const next = operators.find(o => o.id > cursor) || operators[0];
    deal.operatorId = next.id;
    deal.stageId = 'op_yangi';
    await this.settings.set(AUTO_ASSIGN_CURSOR_KEY, String(next.id));
    return this.deals.save(deal);
  }

  canSee(user: UserEntity, deal: DealEntity) {
    return (
      user.role === UserRole.Admin ||
      user.permissions?.all === true ||
      deal.ownerId === user.id ||
      (user.role === UserRole.Operator && deal.operatorId === user.id) ||
      // Menejer hali biriktirilmagan lidni ochib ishlay oladi: menejer voronkasidagi egasiz lid,
      // YOKI operator malakali qilib menejerga yuborilgan (op_malakali + sentToManager) egasiz lid.
      // list() ham xuddi shu qoida bilan qaytaradi, aks holda "Shartnoma topilmadi" bo'lardi.
      (user.role === UserRole.Manager && deal.ownerId == null &&
        (!OPERATOR_STAGE_IDS.includes(deal.stageId) || (deal.stageId === OPERATOR_QUAL_STAGE_ID && deal.sentToManager === true)))
    );
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
    // Menejer: o'ziga biriktirilgan YOKI hali biriktirilmagan lidlar — menejer voronkasidagilar,
    // hamda operator malakali qilib yuborgan (op_malakali + sentToManager) egasiz lidlar.
    return this.deals.createQueryBuilder('deal')
      .where('(deal.ownerId = :id OR (deal.ownerId IS NULL AND (deal.stageId NOT IN (:...opStages) OR (deal.stageId = :qual AND deal.sentToManager = true))))', {
        id: user.id,
        opStages: OPERATOR_STAGE_IDS,
        qual: OPERATOR_QUAL_STAGE_ID,
      })
      .orderBy('deal.id', 'ASC')
      .getMany();
  }

  async create(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    await this.users.markActiveOnAction(user.id);
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
      // op_malakali'da yaratilgan lid to'g'ridan-to'g'ri menejerlarga ochilsin
      qualAt: body.qualAt || ((body.stageId || defaultStageId) === OPERATOR_QUAL_STAGE_ID ? new Date().toISOString() : null),
      sentToManager: Boolean(body.sentToManager) || (body.stageId || defaultStageId) === OPERATOR_QUAL_STAGE_ID,
      courseDuration: Number.isInteger(Number(body.courseDuration)) && Number(body.courseDuration) >= 1 && Number(body.courseDuration) <= 6 ? Number(body.courseDuration) : null,
      paymentType: VALID_PAYMENT_TYPES.includes(body.paymentType) ? body.paymentType : null,
      createdBy: user.id,
      events: [{ type: 'created', at: new Date().toISOString(), by: user.id, role: user.role }]
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
    await this.users.markActiveOnAction(user.id);
    const deal = await this.deals.findOne({ where: { id } });
    if (!deal || !this.canSee(user, deal)) throw new NotFoundException('Shartnoma topilmadi');
    // Menejer egasiz (operator malakali qilgan) lidga izoh/o'zgarish kiritsa, lid o'ziga
    // biriktiriladi — kim birinchi ishlashni boshlasa, o'shaniki. Boshqa menejerlar
    // ro'yxatida u endi ko'rinmaydi, konflikt yo'qoladi.
    if (user.role === UserRole.Manager && deal.ownerId == null) {
      deal.ownerId = user.id;
      this.logEvent(deal, 'claimed', user.id, { to: user.id });
    }
    const prevStageId = deal.stageId;
    const prevCommentsLength = deal.comments?.length || 0;
    const nextStageId = body.stageId !== undefined ? String(body.stageId) : deal.stageId;
    const nextPrice = body.price !== undefined ? this.parsePrice(body.price) : this.parsePrice(deal.price);
    this.assertStageRules(nextStageId, nextPrice, body, user, deal);
    if (nextStageId !== prevStageId && user.role !== UserRole.Admin && user.permissions?.all !== true) {
      await this.assertStageChangeJustified(deal, body, prevCommentsLength);
    }
    // Bosqich o'zgarishini tarixga yozamiz (foydalanuvchi ochiq ko'chirgan bo'lsa)
    if (body.stageId !== undefined && String(body.stageId) !== prevStageId) {
      this.logEvent(deal, 'stage', user.id, { from: prevStageId, to: String(body.stageId) });
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
      if (deal.ownerId && deal.ownerId !== prevOwnerId) {
        this.logEvent(deal, 'assigned', user.id, { to: deal.ownerId });
      }
      // Operator voronkasidagi lid menejerga biriktirilsa, bosqichi ham menejer voronkasiga o'tadi.
      // (Modal saqlashda body.stageId ham keladi — o'sha holatda ham xaritalash shart, aks holda
      // lid op_* bosqichida "yopishib" qolib, menejer kanbanida ko'rinmay qolardi.)
      if (deal.ownerId && OPERATOR_STAGE_IDS.includes(deal.stageId)) {
        deal.stageId = this.mapOperatorStageToManager(deal.stageId);
        // Xuddi shu mijozning egasiz echo nusxasini yutib yuboramiz — ikkita menejer
        // bitta mijoz ustida ishlab qolmasin
        await this.absorbUnassignedEcho(deal);
      }
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
    // Full call — har bir qo'ng'iroq alohida hodisa. addFullCall bitta qo'ng'iroq qo'shadi,
    // removeLastFullCall oxirgisini olib tashlaydi. Eski toggle (body.fullCall) ham ishlaydi.
    if (body.addFullCall || body.removeLastFullCall || body.fullCall !== undefined) {
      if (user.role !== UserRole.Manager) throw new ForbiddenException('Faqat menejer full call belgisini qo‘ya oladi');
      const list = Array.isArray(deal.fullCalls) ? [...deal.fullCalls]
        : (deal.fullCall && deal.fullCallAt ? [deal.fullCallAt] : []);
      if (body.addFullCall) list.push(new Date().toISOString());
      else if (body.removeLastFullCall) list.pop();
      else if (body.fullCall !== undefined) {
        // Orqaga moslik: yoqilsa hodisa yo'q bo'lsa bittasini qo'shadi, o'chirilsa hammasini tozalaydi
        if (Boolean(body.fullCall)) { if (!list.length) list.push(new Date().toISOString()); }
        else list.length = 0;
      }
      deal.fullCalls = list;
      deal.fullCall = list.length > 0;
      deal.fullCallAt = list.length ? list[list.length - 1] : null;
    }
    if (body.sentToManager !== undefined) deal.sentToManager = Boolean(body.sentToManager);
    if (body.courseDuration !== undefined) {
      const duration = Number(body.courseDuration);
      deal.courseDuration = Number.isInteger(duration) && duration >= 1 && duration <= 6 ? duration : null;
    }
    if (body.paymentType !== undefined) {
      deal.paymentType = VALID_PAYMENT_TYPES.includes(body.paymentType) ? body.paymentType : null;
    }
    // Qisman to'lov qo'shish: joyni band qilish yoki aktsiyaga ulgurish uchun mijoz
    // summaning bir qismini to'laydi. Bitim avtomatik "Qisman to'lov" bosqichiga tushadi
    // va menejerga qolgan pulni undirish bo'yicha muddatli vazifa yaratiladi.
    if (body.addPayment !== undefined) {
      const amount = Math.round(Number(body.addPayment?.amount));
      if (!Number.isFinite(amount) || amount <= 0) throw new BadRequestException("To'lov summasini kiriting");
      const price = Number(deal.price || 0);
      if (price <= 0) throw new BadRequestException("Avval shartnoma summasini kiriting");
      const paid = Number(deal.paidAmount || 0);
      if (paid + amount > price) {
        throw new BadRequestException(`To'lov qoldiqdan oshib ketdi — qoldiq: ${(price - paid).toLocaleString('uz-UZ')} so'm`);
      }
      const method = VALID_PAYMENT_TYPES.includes(body.addPayment?.method) ? body.addPayment.method : 'naqd';
      const nowIso = new Date().toISOString();
      deal.payments = [...(deal.payments || []), { amount, method, at: nowIso, by: user.id }];
      deal.paidAmount = paid + amount;
      if (!deal.firstPaymentAt) deal.firstPaymentAt = nowIso;
      const remaining = price - Number(deal.paidAmount);
      if (remaining > 0) {
        // To'liq to'lanmagan bitim Yutganda turolmaydi — Qisman to'lov bosqichiga o'tkazamiz
        if (body.stageId === undefined && deal.stageId !== WON_STAGE_ID && !OPERATOR_STAGE_IDS.includes(deal.stageId)) {
          deal.stageId = PARTIAL_STAGE_ID;
        }
        // Eslatma vazifasi — bitim bo'yicha ochiq vazifa bo'lmasa yaratamiz
        if (!(await this.tasks.hasOpenTaskForDeal(deal.id))) {
          await this.tasks.create({
            dealId: deal.id,
            ownerId: deal.ownerId || user.id,
            title: `Qolgan to'lovni undirish: ${remaining.toLocaleString('uz-UZ')} so'm — ${deal.customerName}`,
            due: 'ertaga'
          }, user).catch(() => {});
        }
      }
      this.telegram.sendMessage(
        `💰 <b>Qisman to‘lov</b>\n\n` +
        `👤 Mijoz: <b>${deal.customerName}</b>\n` +
        `💵 To‘landi: <b>${amount.toLocaleString('uz-UZ')} so’m</b> (jami ${Number(deal.paidAmount).toLocaleString('uz-UZ')} / ${price.toLocaleString('uz-UZ')})\n` +
        `${remaining > 0 ? `⏳ Qoldiq: <b>${remaining.toLocaleString('uz-UZ')} so’m</b>` : `✅ To‘liq to‘landi`}`
      ).catch(() => {});
    }
    if (nextStageId === OPERATOR_QUAL_STAGE_ID && prevStageId !== OPERATOR_QUAL_STAGE_ID && !deal.sentToManager) {
      await this.handoffQualifiedLead(deal, user);
    }
    if (nextStageId === WON_STAGE_ID && prevStageId !== WON_STAGE_ID) {
      // Yutganga o'tishda to'lovlar tarixini yakunlaymiz: qolgan summa bitta to'lov sifatida yoziladi
      // (qisman to'lovsiz klassik oqimda bu butun summa bo'ladi). Invariant: Yutgan = to'liq to'langan.
      const paidSoFar = Number(deal.paidAmount || 0);
      const fullPrice = Number(deal.price || 0);
      const rest = Math.max(0, fullPrice - paidSoFar);
      if (rest > 0) {
        const nowIso = new Date().toISOString();
        deal.payments = [...(deal.payments || []), { amount: rest, method: deal.paymentType || 'naqd', at: nowIso, by: user.id }];
        deal.paidAmount = fullPrice;
        if (!deal.firstPaymentAt) deal.firstPaymentAt = nowIso;
      }
      // Telegram xabari faqat shu payt HAQIQATAN yangi pul kelganda yuboriladi.
      // Qisman to'lovlar orqali allaqachon to'liq to'langan bitim uchun (rest === 0) pul
      // "Qisman to'lov ... To'liq to'landi" xabari bilan e'lon qilingan — takror yubormaymiz.
      if (rest > 0) {
        const managerName = user.name || user.email || 'Menejer';
        const price = deal.price ? `${Number(deal.price).toLocaleString('uz-UZ')} so’m` : 'narx ko’rsatilmagan';
        const phone = deal.phone || (deal.phones?.[0]) || '—';
        this.telegram.sendMessage(
          `🎉 <b>Yangi to‘lov!</b>\n\n` +
          `👤 Mijoz: <b>${deal.customerName}</b>\n` +
          `📞 Tel: ${phone}\n` +
          `💰 Summa: <b>${price}</b>\n` +
          `👨‍💼 Menejer: ${managerName}`
        ).catch(() => {});
      }
    }
    // Menejer egasi bo'lgan lid operator voronkasi bosqichida qolib ketmasin — menejer o'ziga
    // olgan (claim) yoki admin biriktirgan op_malakali lid endi oddiy menejer lidi (malakali).
    if (deal.ownerId != null && OPERATOR_STAGE_IDS.includes(deal.stageId)) {
      deal.stageId = this.mapOperatorStageToManager(deal.stageId);
    }
    const saved = await this.deals.save(deal);
    // Menejerga tegishli bo'lib qolgan lid uchun bir xil telefonli dublikatni birlashtiramiz.
    // Agar shu yozuvning o'zi birlashuvda o'chib ketsa, saqlangan yozuvni qaytaramiz.
    if (saved.ownerId != null && !OPERATOR_STAGE_IDS.includes(saved.stageId)) {
      const keeperId = await this.mergeDuplicateManagerLeads(this.phoneKey(saved));
      if (keeperId && keeperId !== saved.id) {
        return (await this.deals.findOne({ where: { id: keeperId } })) || saved;
      }
    }
    return saved;
  }

  // Tizim hodisasini lid tarixiga yozadi
  private logEvent(deal: DealEntity, type: string, by: number | null, extra: Record<string, any> = {}) {
    if (!Array.isArray(deal.events)) deal.events = [];
    deal.events = [...deal.events, { type, at: new Date().toISOString(), by, ...extra }];
  }

  private mapOperatorStageToManager(stageId: string) {
    if (stageId === 'op_malakali') return 'malakali';
    if (stageId === 'op_yutqazilgan') return 'yutqazilgan';
    return 'yangi'; // op_yangi, op_qayta
  }

  // Operator lidni "Malakali" qilganda: ALOHIDA echo yozuv YARATILMAYDI (single-row model).
  // O'sha lidning o'zi menejer havzasiga ochiladi — lid op_malakali'da qoladi (operator o'z
  // "Malakali" ustunida ko'radi), sentToManager=true bo'lgani uchun menejerlar ham uni ko'radi
  // (list()/canSee shu bayroqni tan oladi). Menejer tegsa — o'ziga biriktiriladi va bosqichi
  // malakali'ga o'tadi. Shu tariqa bitta lid = bitta yozuv, dublikat jismonan mumkin emas.
  private async handoffQualifiedLead(deal: DealEntity, user: UserEntity) {
    deal.sentToManager = true;
    if (!deal.qualAt) deal.qualAt = new Date().toISOString();
    if (!deal.operatorId) deal.operatorId = user.id;
    this.logEvent(deal, 'qualified', user.id);
    await this.notifyManagersNewQualLead(deal, user.id);
  }

  private async notifyManagersNewQualLead(deal: DealEntity, fromUserId: number) {
    try {
      const managers = await this.users.findManagers();
      managers.forEach(m => {
        this.notifications.sendToUser(m.id, {
          type: 'qual_lead',
          title: 'Yangi malakali lid keldi',
          body: `"${deal.customerName}" — operator malakali qildi, birinchi ishlagan menejerga biriktiriladi`,
          dealId: deal.id,
          fromUserId,
          userId: m.id
        }).catch(() => {});
      });
    } catch {}
  }

  // Menejerga biriktirilayotgan asl (op_*) lidning EGASIZ echo nusxalarini yutib yuboradi:
  // handoff paytida yaratilgan echo (bir xil telefon, menejer voronkasi bosqichi, ownerId NULL)
  // biriktirishdan keyin ham hamma menejerga ko'rinib turaverar edi — ikki menejer bitta mijoz
  // ustida ishlashi mumkin edi. Echo'dagi qo'shimcha izohlar asl yozuvga ko'chiriladi,
  // so'ng echo o'chiriladi. O'chirilgan idlar ro'yxati qaytadi.
  private async absorbUnassignedEcho(original: DealEntity): Promise<number[]> {
    if (!original.phone) return [];
    const echoes = await this.deals.createQueryBuilder('deal')
      .where('deal.id != :id', { id: original.id })
      .andWhere('deal.phone = :phone', { phone: original.phone })
      .andWhere('deal.ownerId IS NULL')
      .andWhere('deal.stageId NOT IN (:...opStages)', { opStages: OPERATOR_STAGE_IDS })
      .getMany();
    if (!echoes.length) return [];
    const have = new Set((original.comments || []).map(c => `${c.time}|${c.text}`));
    echoes.forEach(echo => (echo.comments || []).forEach(c => {
      const key = `${c.time}|${c.text}`;
      if (!have.has(key)) {
        original.comments = [...(original.comments || []), c];
        have.add(key);
      }
    }));
    const ids = echoes.map(e => e.id);
    await this.deals.delete(ids);
    return ids;
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
      const absorbed = new Set<number>();
      for (const deal of rows) {
        if (ownerId && ownerId !== deal.ownerId) this.logEvent(deal, 'assigned', user.id, { to: ownerId });
        deal.ownerId = ownerId;
        // Operator voronkasidagi lid menejerga o'tsa, bosqichini ham menejer voronkasiga
        // o'tkazamiz — aks holda menejer kanbanida op_* ustuni yo'qligi uchun lid ko'rinmaydi.
        if (ownerId && OPERATOR_STAGE_IDS.includes(deal.stageId)) {
          deal.stageId = this.mapOperatorStageToManager(deal.stageId);
          (await this.absorbUnassignedEcho(deal)).forEach(id => absorbed.add(id));
        }
      }
      // Admin asl nusxa bilan birga echo'ni ham tanlagan bo'lsa, o'chirilgan echo
      // save() orqali qayta tirilib qolmasligi kerak
      const toSave = absorbed.size ? rows.filter(r => !absorbed.has(Number(r.id))) : rows;
      const saved = await this.deals.save(toSave);
      // Har bir menejerga tegishli lid uchun bir xil telefonli dublikatni birlashtiramiz
      const keys = new Set<string>();
      saved.forEach(d => { if (d.ownerId != null && !OPERATOR_STAGE_IDS.includes(d.stageId)) { const k = this.phoneKey(d); if (k) keys.add(k); } });
      for (const k of keys) await this.mergeDuplicateManagerLeads(k);
      return { deals: saved };
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
    const nowIso = new Date().toISOString();
    rows.forEach(deal => {
      if (deal.stageId !== stageId) this.logEvent(deal, 'stage', user.id, { from: deal.stageId, to: stageId });
      deal.stageId = stageId;
      // op_malakali'ga ommaviy ko'chirilgan operator lidi ham menejerlarga ochilsin (handoff bayrog'i)
      if (stageId === OPERATOR_QUAL_STAGE_ID && !deal.sentToManager) {
        deal.sentToManager = true;
        if (!deal.qualAt) deal.qualAt = nowIso;
      }
    });
    const saved = await this.deals.save(rows);
    if (stageId === OPERATOR_QUAL_STAGE_ID) {
      for (const deal of saved) await this.notifyManagersNewQualLead(deal, user.id);
    }
    return saved;
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
    if (rows.length) {
      rows.forEach(deal => { deal.stageId = 'op_yangi'; });
      await this.deals.save(rows);
    }
    // Teskari holat: menejerga biriktirilgan (ownerId bor), lekin bosqichi hali operator
    // voronkasida qolib ketgan lidlar — menejer kanbanida ko'rinmay qoladi, shularni ham tuzatamiz.
    const stuck = await this.deals.createQueryBuilder('deal')
      .where('deal.ownerId IS NOT NULL')
      .andWhere('deal.stageId IN (:...stageIds)', { stageIds: OPERATOR_STAGE_IDS })
      .getMany();
    if (stuck.length) {
      stuck.forEach(deal => { deal.stageId = this.mapOperatorStageToManager(deal.stageId); });
      await this.deals.save(stuck);
    }
    return { fixed: rows.length + stuck.length, ids: [...rows, ...stuck].map(row => row.id) };
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

  // Taqqoslash uchun telefonni faqat raqamlarga keltiradi (formatdan qat'i nazar bir xil bo'lsin)
  private phoneKey(deal: { phone?: string; phones?: string[] }): string {
    const raw = deal.phone || (Array.isArray(deal.phones) ? deal.phones[0] : '') || '';
    return String(raw).replace(/\D/g, '');
  }

  // Bir xil telefonli lid ikki menejerda bo'lib qolmasligini ta'minlaydi.
  // Menejer voronkasidagi (op_* emas) egali bir xil telefonli lidlardan eng faolini
  // (ko'p izohli, teng bo'lsa eng eski) saqlaydi, qolganlarining izoh/vazifalarini unga
  // ko'chiradi va o'zlarini o'chiradi. Saqlangan lid id sini qaytaradi.
  private async mergeDuplicateManagerLeads(phoneKey: string): Promise<number | null> {
    if (!phoneKey) return null;
    const owned = await this.deals.createQueryBuilder('deal')
      .where('deal.ownerId IS NOT NULL')
      .andWhere('deal.stageId NOT IN (:...op)', { op: OPERATOR_STAGE_IDS })
      .getMany();
    const group = owned.filter(d => this.phoneKey(d) === phoneKey);
    if (group.length < 2) return group[0]?.id ?? null;
    // Ikki yoki undan ortiq yakunlangan (sotilgan/to'langan) yozuvni birlashtirmaymiz — pulni yo'qotmaslik uchun
    if (group.filter(d => this.isAdvancedDeal(d)).length >= 2) return group[0].id;
    const score = (d: DealEntity) => (d.comments?.length || 0);
    group.sort((a, b) => score(b) - score(a) || a.id - b.id);
    const keeper = group[0];
    const dropped = group.slice(1);
    const seen = new Set((keeper.comments || []).map(c => `${c.time}|${c.text}`));
    for (const d of dropped) {
      (d.comments || []).forEach(c => {
        const k = `${c.time}|${c.text}`;
        if (!seen.has(k)) { keeper.comments = [...(keeper.comments || []), c]; seen.add(k); }
      });
      await this.tasks.reassignDealTasks(d.id, keeper.id, keeper.ownerId);
    }
    await this.deals.save(keeper);
    await this.deals.delete(dropped.map(d => d.id));
    return keeper.id;
  }

  // Lidni aniqlash kaliti: telefon raqami (faqat raqamlar), bo'lmasa mijoz ismi.
  // Telefon bo'sh bo'lgan dublikatlar ham ism bo'yicha ushlanadi.
  private leadIdentityKey(deal: { phone?: string; phones?: string[]; customerName?: string }): string {
    const pk = this.phoneKey(deal);
    if (pk) return 'p:' + pk;
    const name = String(deal.customerName || '').trim().toLowerCase();
    return name ? 'n:' + name : '';
  }

  // Yozuv "yakunlangan" (sotilgan yoki puli tushgan) — ehtiyot bo'lish kerak bo'lgan holat
  private isAdvancedDeal(d: DealEntity): boolean {
    return d.stageId === WON_STAGE_ID || Number(d.paidAmount || 0) > 0;
  }
  // Guruhdan saqlanadigan yozuvni tanlaydi: egasi bori (menejer ishlayotgani), bo'lmasa operator
  // originali (operator ko'rishda davom etsin), bo'lmasa eng faoli/eng eski.
  private pickSurvivor(pool: DealEntity[]): DealEntity {
    const score = (d: DealEntity) => (d.comments?.length || 0);
    const owned = pool.filter(d => d.ownerId != null);
    if (owned.length) return owned.sort((a, b) => score(b) - score(a) || a.id - b.id)[0];
    const orig = pool.filter(d => OPERATOR_STAGE_IDS.includes(d.stageId));
    if (orig.length) return orig.sort((a, b) => score(b) - score(a) || a.id - b.id)[0];
    return [...pool].sort((a, b) => score(b) - score(a) || a.id - b.id)[0];
  }

  // Boot migratsiyasi: bitta lidning bir nechta yozuvini (echo/original va dublikatlar) BITTA
  // yozuvga birlashtiradi — single-row modelga o'tkazadi.
  // XAVFSIZLIK: bir xil telefonli IKKI YOKI UNDAN ORTIQ yakunlangan (sotilgan/to'langan) yozuvni
  // avtomatik birlashtirmaydi (ular haqiqiy alohida sotuvlar bo'lishi mumkin) — faqat ogohlantiradi.
  // Idempotent: tozalangandan keyin har bir lid bitta yozuv bo'lib qoladi.
  private async consolidateDuplicateLeads(): Promise<void> {
    const all = await this.deals.find({ order: { id: 'ASC' } });
    const groups = new Map<string, DealEntity[]>();
    for (const d of all) {
      const key = this.leadIdentityKey(d);
      if (!key) continue;
      const arr = groups.get(key) || [];
      arr.push(d);
      groups.set(key, arr);
    }
    let removed = 0, flagged = 0;
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      const advanced = group.filter(d => this.isAdvancedDeal(d));
      if (advanced.length >= 2) { flagged++; continue; } // 2+ sotuv — qo'lda ko'rib chiqilsin
      const keepPool = advanced.length === 1 ? advanced : group.filter(d => !this.isAdvancedDeal(d));
      const survivor = this.pickSurvivor(keepPool);
      const dropped = group.filter(d => d.id !== survivor.id);
      const seen = new Set((survivor.comments || []).map(c => `${c.time}|${c.text}`));
      for (const d of dropped) {
        (d.comments || []).forEach(c => {
          const k = `${c.time}|${c.text}`;
          if (!seen.has(k)) { survivor.comments = [...(survivor.comments || []), c]; seen.add(k); }
        });
        await this.tasks.reassignDealTasks(d.id, survivor.id, survivor.ownerId ?? null);
      }
      // Single-row holat: egali lid op bosqichda qolmasin; egasiz operator originali menejerlarga ochiq bo'lsin
      if (survivor.ownerId != null && OPERATOR_STAGE_IDS.includes(survivor.stageId)) {
        survivor.stageId = this.mapOperatorStageToManager(survivor.stageId);
      } else if (survivor.ownerId == null && survivor.stageId === OPERATOR_QUAL_STAGE_ID) {
        survivor.sentToManager = true;
      }
      await this.deals.save(survivor);
      await this.deals.delete(dropped.map(d => d.id));
      removed += dropped.length;
    }
    if (removed || flagged) console.log(`consolidateDuplicateLeads: ${removed} ta dublikat birlashtirildi${flagged ? `, ${flagged} ta guruh qo'lda ko'rib chiqilsin (2+ sotuv)` : ''}`);
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

  // Bosqich o'zgarganda, kamida 4 so'zli izoh yoki ochiq vazifa talab qilamiz —
  // aks holda lidlar "k", "ochiq" kabi mazmunsiz belgilar bilan siljib, yo'qotish sababi hech qachon yozilmay qoladi.
  // Yangi qo'shilgan izoh ham, yaqinda (30 daqiqa ichida) yozilgan izoh ham asos bo'ladi — menejer
  // mijoz bilan gaplashib turib izoh yozgan bo'lsa, bosqich o'zgarishida qayta izoh yozishi shart emas.
  private async assertStageChangeJustified(deal: DealEntity, body: any, prevCommentsLength: number) {
    if (await this.tasks.hasOpenTaskForDeal(deal.id)) return;
    const comments = Array.isArray(body.comments) ? body.comments : deal.comments;
    if (Array.isArray(comments) && comments.length) {
      const recentCutoff = Date.now() - 30 * 60 * 1000;
      const justified = comments.some((c: any, i: number) => {
        if (String(c?.text || '').trim().split(/\s+/).filter(Boolean).length < 4) return false;
        const isNew = Array.isArray(body.comments) && i >= prevCommentsLength; // shu so'rovda qo'shilgan
        const t = c?.time ? new Date(c.time).getTime() : 0;
        return isNew || (t && t >= recentCutoff);
      });
      if (justified) return;
    }
    throw new BadRequestException('Bosqichni o‘zgartirish uchun kamida 4 so‘zdan iborat izoh yozing yoki ochiq vazifa qo‘ying');
  }

  private assertStageRules(stageId: string, price: number, body: any, user: UserEntity, deal: DealEntity | null) {
    if ([AGREED_STAGE_ID, WON_STAGE_ID].includes(stageId) && (!Number.isFinite(price) || price <= 0)) {
      throw new BadRequestException('Bu bosqichga o‘tish uchun shartnoma summasini kiriting');
    }
    const isNewWon = stageId === WON_STAGE_ID && deal?.stageId !== WON_STAGE_ID;
    if (isNewWon && deal) {
      // Invariant: Muvaffaqiyatli = to'liq to'langan. Qisman to'lovli bitim avval to'liq yopilishi shart —
      // aks holda pro-akkaunt/bonus avtomatikasi noto'g'ri ishlaydi.
      const paid = Number(deal.paidAmount || 0);
      if (paid > 0 && paid < price) {
        throw new BadRequestException(
          `Bitim to'liq to'lanmagan (qoldiq: ${(price - paid).toLocaleString('uz-UZ')} so'm). Avval "To'lov qo'shish" orqali qolgan summani kiriting`
        );
      }
    }
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

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../users/domain/user-role.enum';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { TaskEntity } from '../infrastructure/task.entity';
import { DealEntity } from '../../deals/infrastructure/deal.entity';
import { NotificationsGateway } from '../../notifications/notifications.gateway';
import { UsersService } from '../../users/application/users.service';

// Operator lidini menejerga topshirganda bosqichni menejer voronkasiga o'tkazish xaritasi
// (DealsService.mapOperatorStageToManager bilan bir xil — circular importdan qochish uchun takror).
const OP_STAGE_TO_MANAGER: Record<string, string> = {
  op_malakali: 'malakali',
  op_yutqazilgan: 'yutqazilgan',
  op_yangi: 'yangi',
  op_qayta: 'yangi'
};

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity) private readonly tasks: Repository<TaskEntity>,
    @InjectRepository(DealEntity) private readonly deals: Repository<DealEntity>,
    private readonly notifications: NotificationsGateway,
    private readonly users: UsersService
  ) {}

  list(user: UserEntity) {
    this.assertCrmAccess(user);
    if (this.canManageAll(user)) return this.tasks.find({ order: { id: 'ASC' } });
    return this.tasks.find({ where: { ownerId: user.id }, order: { id: 'ASC' } });
  }

  async create(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    await this.users.markActiveOnAction(user.id);
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Vazifa nomi kerak');
    // Vazifa egasini aniqlaymiz:
    //  - admin / all ruxsatli: istalgan foydalanuvchi (body.ownerId), yo'q bo'lsa o'zi
    //  - operator: o'ziga, boshqa operatorga yoki menejerga (body.ownerId), yo'q bo'lsa o'zi
    //  - oddiy menejer: faqat o'zi
    let ownerId: number;
    if (this.canManageAll(user)) {
      ownerId = Number(body.ownerId || user.id);
    } else if (user.role === UserRole.Operator) {
      ownerId = Number(body.ownerId || user.id);
    } else {
      ownerId = user.id;
    }
    const dealId = body.dealId ? Number(body.dealId) : null;
    // Operator lidga BOSHQA birov uchun vazifa qo'ysa, lid o'sha odamga o'tadi:
    //  - menejer  → menejer voronkasiga handoff (lid menejerники bo'ladi)
    //  - boshqa operator → lid o'sha operatorga o'tadi (operator voronkasida qoladi)
    //  - o'ziga (self) → hech narsa o'tmaydi, oddiy eslatma vazifasi
    if (user.role === UserRole.Operator && dealId && ownerId && ownerId !== user.id) {
      const target = await this.users.findById(ownerId);
      if (target?.role === UserRole.Manager) {
        await this.handoffDealToManager(dealId, ownerId, user.id);
      } else if (target?.role === UserRole.Operator) {
        await this.reassignDealToOperator(dealId, ownerId, user.id);
      }
    }
    const task = await this.tasks.save(this.tasks.create({
      dealId,
      ownerId,
      title,
      due: String(body.due || 'Bugun'),
      done: Boolean(body.done)
    }));
    // Vazifa mas'uliga xabar yuboramiz (o'ziga emas)
    if (ownerId && ownerId !== user.id) {
      this.notifications.sendToUser(ownerId, {
        type: 'task_created',
        title: 'Yangi vazifa biriktirildi',
        body: `"${title}" — siz uchun yangi vazifa qo'yildi. Muddat: ${body.due || 'Bugun'}`,
        dealId: body.dealId ? Number(body.dealId) : null,
        fromUserId: user.id,
        userId: ownerId
      }).catch(() => {});
    }
    return task;
  }

  async update(id: number, body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    await this.users.markActiveOnAction(user.id);
    const task = await this.tasks.findOne({ where: { id } });
    if (!task || (!this.canManageAll(user) && task.ownerId !== user.id)) throw new NotFoundException('Vazifa topilmadi');
    ['title', 'due'].forEach(key => {
      if (body[key] !== undefined) task[key] = String(body[key]);
    });
    if (body.done !== undefined) task.done = Boolean(body.done);
    if (body.ownerId !== undefined && this.canManageAll(user)) task.ownerId = Number(body.ownerId);
    return this.tasks.save(task);
  }

  async hasOpenTaskForDeal(dealId: number) {
    return (await this.tasks.count({ where: { dealId, done: false } })) > 0;
  }

  // Operator lidga menejer uchun vazifa qo'yganda lidni o'sha menejerga topshiradi:
  // egasini o'rnatadi, operator voronkasi bosqichini menejer voronkasiga o'tkazadi va
  // handoff bayrog'ini (sentToManager) qo'yadi. Shu tariqa lid menejerning ustuniga tushadi.
  async handoffDealToManager(dealId: number, managerId: number, byUserId: number) {
    const deal = await this.deals.findOne({ where: { id: dealId } });
    if (!deal || deal.ownerId === managerId) return;
    deal.ownerId = managerId;
    if (OP_STAGE_TO_MANAGER[deal.stageId]) deal.stageId = OP_STAGE_TO_MANAGER[deal.stageId];
    deal.sentToManager = true;
    if (!deal.qualAt) deal.qualAt = new Date().toISOString();
    if (!deal.operatorId) deal.operatorId = byUserId;
    if (!Array.isArray(deal.events)) deal.events = [];
    deal.events = [...deal.events, { type: 'assigned', at: new Date().toISOString(), by: byUserId, to: managerId }];
    await this.deals.save(deal);
  }

  // Operator lidga boshqa operator uchun vazifa qo'yganda lidni o'sha operatorga topshiradi:
  // operatorId yangi operatorga o'zgaradi (lid operator voronkasida qoladi, menejerga o'tmaydi).
  // Shu tariqa yangi operator lidni ko'radi va ishlaydi.
  async reassignDealToOperator(dealId: number, operatorId: number, byUserId: number) {
    const deal = await this.deals.findOne({ where: { id: dealId } });
    if (!deal || deal.operatorId === operatorId) return;
    deal.operatorId = operatorId;
    if (!Array.isArray(deal.events)) deal.events = [];
    deal.events = [...deal.events, { type: 'assigned', at: new Date().toISOString(), by: byUserId, to: operatorId }];
    await this.deals.save(deal);
  }

  // Dublikat lidlar birlashtirilganda vazifalarni saqlanib qolgan lidga ko'chiradi
  async reassignDealTasks(fromDealId: number, toDealId: number, ownerId: number | null) {
    const rows = await this.tasks.find({ where: { dealId: fromDealId } });
    if (!rows.length) return;
    rows.forEach(t => { t.dealId = toDealId; if (ownerId != null) t.ownerId = ownerId; });
    await this.tasks.save(rows);
  }

  private canManageAll(user: UserEntity) {
    return user.role === UserRole.Admin || user.permissions?.all === true;
  }

  private assertCrmAccess(user: UserEntity) {
    if (user.role !== UserRole.Admin && user.permissions?.crm === false) {
      throw new ForbiddenException('CRM ruxsati yopilgan');
    }
  }
}

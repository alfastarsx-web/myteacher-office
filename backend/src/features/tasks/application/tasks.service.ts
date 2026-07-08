import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../users/domain/user-role.enum';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { TaskEntity } from '../infrastructure/task.entity';
import { NotificationsGateway } from '../../notifications/notifications.gateway';
import { UsersService } from '../../users/application/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity) private readonly tasks: Repository<TaskEntity>,
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
    const ownerId = this.canManageAll(user) ? Number(body.ownerId || user.id) : user.id;
    const task = await this.tasks.save(this.tasks.create({
      dealId: body.dealId ? Number(body.dealId) : null,
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

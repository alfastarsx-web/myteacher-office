import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../users/domain/user-role.enum';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { TaskEntity } from '../infrastructure/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(TaskEntity) private readonly tasks: Repository<TaskEntity>) {}

  list(user: UserEntity) {
    this.assertCrmAccess(user);
    if (this.canManageAll(user)) return this.tasks.find({ order: { id: 'ASC' } });
    return this.tasks.find({ where: { ownerId: user.id }, order: { id: 'ASC' } });
  }

  create(body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Vazifa nomi kerak');
    return this.tasks.save(this.tasks.create({
      dealId: body.dealId ? Number(body.dealId) : null,
      ownerId: this.canManageAll(user) ? Number(body.ownerId || user.id) : user.id,
      title,
      due: String(body.due || 'Bugun'),
      done: Boolean(body.done)
    }));
  }

  async update(id: number, body: any, user: UserEntity) {
    this.assertCrmAccess(user);
    const task = await this.tasks.findOne({ where: { id } });
    if (!task || (!this.canManageAll(user) && task.ownerId !== user.id)) throw new NotFoundException('Vazifa topilmadi');
    ['title', 'due'].forEach(key => {
      if (body[key] !== undefined) task[key] = String(body[key]);
    });
    if (body.done !== undefined) task.done = Boolean(body.done);
    if (body.ownerId !== undefined && this.canManageAll(user)) task.ownerId = Number(body.ownerId);
    return this.tasks.save(task);
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

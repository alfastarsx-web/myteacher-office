import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { JwtAuthGuard } from '../auth/presentation/jwt-auth.guard';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifications: Repository<NotificationEntity>
  ) {}

  @Get()
  async list(@Req() req: any) {
    const userId = req.user.id;
    const items = await this.notifications.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50
    });
    const unreadCount = items.filter(n => !n.read).length;
    return { notifications: items, unreadCount };
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    await this.notifications.update({ id: Number(id), userId }, { read: true });
    return { ok: true };
  }

  @Patch('read-all')
  async markAllRead(@Req() req: any) {
    const userId = req.user.id;
    await this.notifications.update({ userId, read: false }, { read: true });
    return { ok: true };
  }
}

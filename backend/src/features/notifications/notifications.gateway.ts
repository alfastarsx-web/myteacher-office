import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { NotificationEntity } from './notification.entity';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/notifications'
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  // userId → socket.id mapping
  private userSockets = new Map<number, string[]>();

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifications: Repository<NotificationEntity>,
    private readonly jwt: JwtService
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) { socket.disconnect(); return; }
      const payload = this.jwt.verify(token) as { sub: number };
      const userId = Number(payload.sub);
      socket.data.userId = userId;

      // Register socket
      const existing = this.userSockets.get(userId) || [];
      this.userSockets.set(userId, [...existing, socket.id]);

      // Send unread notifications on connect
      const unread = await this.notifications.find({
        where: { userId, read: false },
        order: { createdAt: 'DESC' },
        take: 50
      });
      socket.emit('notifications:init', unread);
    } catch {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;
    if (!userId) return;
    const sockets = (this.userSockets.get(userId) || []).filter(id => id !== socket.id);
    if (sockets.length === 0) {
      this.userSockets.delete(userId);
    } else {
      this.userSockets.set(userId, sockets);
    }
  }

  @SubscribeMessage('notifications:read')
  async markRead(socket: Socket, data: { id?: number; all?: boolean }) {
    const userId = socket.data.userId;
    if (!userId) return;
    if (data.all) {
      await this.notifications.update({ userId, read: false }, { read: true });
    } else if (data.id) {
      await this.notifications.update({ id: data.id, userId }, { read: true });
    }
    socket.emit('notifications:read_ok', data);
  }

  // Send notification to specific user
  async sendToUser(userId: number, notification: Omit<NotificationEntity, 'id' | 'createdAt' | 'read'>) {
    try {
      const saved = await this.notifications.save(
        this.notifications.create({ ...notification, userId, read: false })
      );
      const socketIds = this.userSockets.get(userId) || [];
      socketIds.forEach(socketId => {
        this.server.to(socketId).emit('notifications:new', saved);
      });
      return saved;
    } catch (err) {
      // Callers fire-and-forget this (.catch(() => {})) so failures here were previously
      // invisible — log them so a broken notification path shows up in server logs.
      this.logger.error(`Failed to send notification to user ${userId}: ${(err as Error).message}`, (err as Error).stack);
      throw err;
    }
  }

  // Send to multiple users
  async sendToUsers(userIds: number[], notification: Omit<NotificationEntity, 'id' | 'createdAt' | 'read' | 'userId'>) {
    await Promise.all(userIds.map(userId => this.sendToUser(userId, { ...notification, userId })));
  }
}

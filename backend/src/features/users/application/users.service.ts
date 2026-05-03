import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from '../../../common/crypto/password.service';
import { UserRole } from '../domain/user-role.enum';
import { UserEntity } from '../infrastructure/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    private readonly passwords: PasswordService
  ) {}

  async findByEmail(email: string) {
    return this.users.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: number) {
    return this.users.findOne({ where: { id } });
  }

  publicUser(user: UserEntity) {
    const { passwordHash: _passwordHash, ...safe } = user;
    safe.permissions = this.effectivePermissions(user);
    safe.todayOnlineSeconds = this.currentOnlineSeconds(user);
    return safe;
  }

  effectivePermissions(user: UserEntity) {
    const isAdmin = user.role === UserRole.Admin;
    const saved = user.permissions || {};
    return {
      crm: true,
      own: true,
      ...saved,
      all: isAdmin || saved.all === true,
      roles: isAdmin || saved.roles === true
    };
  }

  async listFor(user: UserEntity) {
    const rows = user.role === UserRole.Admin || user.permissions?.roles === true ? await this.users.find() : [user];
    return rows.map(item => this.publicUser(item));
  }

  async create(body: any) {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    if (!name || !email) throw new Error('Ism va email kerak');
    if (await this.findByEmail(email)) throw new ConflictException('Bu email ro‘yxatdan o‘tgan');
    const user = this.users.create({
      name,
      email,
      passwordHash: this.passwords.hash(body.password || 'manager12345'),
      role: body.role === UserRole.Admin ? UserRole.Admin : UserRole.Manager,
      status: body.status || 'Offline',
      onlineDay: this.todayKey(),
      avatar: body.avatar || name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
      color: body.color || 'linear-gradient(135deg,#93c5fd,#3b82f6)',
      permissions: body.permissions || {}
    });
    return this.publicUser(await this.users.save(user));
  }

  async update(id: number, body: any, admin: UserEntity) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Menejer topilmadi');
    if (body.name !== undefined) user.name = String(body.name).trim();
    if (body.email !== undefined) user.email = String(body.email).trim().toLowerCase();
    if (body.password !== undefined) {
      const password = String(body.password || '');
      if (password.length < 8) throw new Error('Parol kamida 8 ta belgidan iborat bo‘lishi kerak');
      user.passwordHash = this.passwords.hash(password);
    }
    if (body.status !== undefined) this.applyStatus(user, String(body.status));
    if (body.permissions !== undefined) user.permissions = { ...(user.permissions || {}), ...body.permissions };
    if (body.role !== undefined && user.id !== admin.id) user.role = body.role === UserRole.Admin ? UserRole.Admin : UserRole.Manager;
    return this.publicUser(await this.users.save(user));
  }

  async updateOwnStatus(user: UserEntity, status: string) {
    const fresh = await this.findById(user.id);
    if (!fresh) throw new NotFoundException('Foydalanuvchi topilmadi');
    this.applyStatus(fresh, status);
    return this.publicUser(await this.users.save(fresh));
  }

  private applyStatus(user: UserEntity, status: string) {
    this.ensureOnlineDay(user);
    if (status === 'Online') {
      user.status = 'Online';
      if (!user.onlineStartedAt) user.onlineStartedAt = new Date();
      return;
    }
    user.status = 'Offline';
    this.stopOnlineTimer(user);
  }

  private currentOnlineSeconds(user: UserEntity) {
    this.ensureOnlineDay(user);
    const base = Number(user.todayOnlineSeconds || 0);
    if (user.status !== 'Online' || !user.onlineStartedAt) return base;
    return base + Math.max(0, Math.floor((Date.now() - new Date(user.onlineStartedAt).getTime()) / 1000));
  }

  private stopOnlineTimer(user: UserEntity) {
    if (user.onlineStartedAt) {
      user.todayOnlineSeconds = this.currentOnlineSeconds(user);
      user.onlineStartedAt = null;
    }
  }

  private ensureOnlineDay(user: UserEntity) {
    const today = this.todayKey();
    if (user.onlineDay !== today) {
      user.onlineDay = today;
      user.todayOnlineSeconds = 0;
      user.onlineStartedAt = user.status === 'Online' ? new Date() : null;
    }
  }

  private todayKey() {
    return new Date().toISOString().slice(0, 10);
  }
}

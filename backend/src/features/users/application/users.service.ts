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
    return safe;
  }

  async listFor(user: UserEntity) {
    const rows = user.role === UserRole.Admin ? await this.users.find() : [user];
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
      avatar: body.avatar || name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
      color: body.color || 'linear-gradient(135deg,#93c5fd,#3b82f6)'
    });
    return this.publicUser(await this.users.save(user));
  }

  async update(id: number, body: any, admin: UserEntity) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Menejer topilmadi');
    if (body.name !== undefined) user.name = String(body.name).trim();
    if (body.email !== undefined) user.email = String(body.email).trim().toLowerCase();
    if (body.status !== undefined) user.status = String(body.status);
    if (body.role !== undefined && user.id !== admin.id) user.role = body.role === UserRole.Admin ? UserRole.Admin : UserRole.Manager;
    return this.publicUser(await this.users.save(user));
  }
}

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import { PasswordService } from '../../../common/crypto/password.service';
import { UsersService } from '../../users/application/users.service';
import { UserRole } from '../../users/domain/user-role.enum';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { RefreshTokenEntity } from '../infrastructure/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly passwords: PasswordService,
    private readonly jwt: JwtService,
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokens: Repository<RefreshTokenEntity>
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !this.passwords.verify(password, user.passwordHash)) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }
    return this.issueTokens(user);
  }

  async register(body: any) {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!name || !email || password.length < 8) {
      throw new BadRequestException('Ism, email va kamida 8 belgili parol kerak');
    }
    const user = await this.users.create({ name, email, password, role: UserRole.Manager, status: 'Online' });
    const entity = await this.users.findById(user.id);
    return this.issueTokens(entity);
  }

  async refresh(refreshToken: string) {
    const hash = this.hash(refreshToken);
    const row = await this.refreshTokens.findOne({ where: { tokenHash: hash }, relations: ['user'] });
    if (!row || row.revokedAt || row.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token yaroqsiz');
    }
    row.revokedAt = new Date();
    await this.refreshTokens.save(row);
    return this.issueTokens(row.user);
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return { ok: true };
    const row = await this.refreshTokens.findOne({ where: { tokenHash: this.hash(refreshToken) } });
    if (row && !row.revokedAt) {
      row.revokedAt = new Date();
      await this.refreshTokens.save(row);
    }
    return { ok: true };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = await this.jwt.verifyAsync(token, { secret: this.accessSecret() });
      return this.users.findById(Number(payload.sub));
    } catch {
      return null;
    }
  }

  private async issueTokens(user: UserEntity) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role, email: user.email },
      { secret: this.accessSecret(), expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
    );
    const refreshToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + this.refreshTtlMs());
    await this.refreshTokens.save(this.refreshTokens.create({
      tokenHash: this.hash(refreshToken),
      expiresAt,
      user,
      userId: user.id
    }));
    return {
      token: accessToken,
      accessToken,
      refreshToken,
      user: this.users.publicUser(user)
    };
  }

  private hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private accessSecret() {
    return process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
  }

  private refreshTtlMs() {
    const days = Number(process.env.JWT_REFRESH_DAYS || 30);
    return days * 24 * 60 * 60 * 1000;
  }
}

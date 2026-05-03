import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../users/domain/user-role.enum';
import { AuthService } from '../application/auth.service';
import type { AuthedRequest } from '../../../types';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const user = token ? await this.auth.validateAccessToken(token) : null;
    if (!user) throw new UnauthorizedException('Unauthorized');
    if (user.role !== UserRole.Admin && user.permissions?.roles !== true) throw new ForbiddenException('Admin permission required');
    req.user = user;
    return true;
  }
}

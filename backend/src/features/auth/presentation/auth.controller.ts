import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthedRequest } from '../../../types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService
  ) {}

  @Post('login')
  login(@Body() body: any) {
    return this.auth.login(String(body.email || '').trim().toLowerCase(), String(body.password || ''));
  }

  @Post('register')
  register(@Body() body: any) {
    return this.auth.register(body);
  }

  @Post('refresh')
  refresh(@Body() body: any) {
    return this.auth.refresh(String(body.refreshToken || ''));
  }

  @Post('logout')
  logout(@Body() body: any) {
    return this.auth.logout(String(body.refreshToken || ''));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthedRequest) {
    return { user: this.users.publicUser(req.user) };
  }
}

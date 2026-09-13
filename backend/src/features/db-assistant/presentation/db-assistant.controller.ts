import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import type { AuthedRequest } from '../../../types';
import { DbAssistantService } from '../application/db-assistant.service';

@Controller('db-assistant')
@UseGuards(AdminGuard)
export class DbAssistantController {
  constructor(private readonly dbAssistant: DbAssistantService) {}

  @Post('sessions')
  async createSession(@Req() req: AuthedRequest) {
    return { session: await this.dbAssistant.createSession(req.user!.id) };
  }

  @Get('sessions')
  async listSessions(@Req() req: AuthedRequest) {
    return { sessions: await this.dbAssistant.listSessions(req.user!.id) };
  }

  @Post('sessions/:id/messages')
  async sendMessage(@Param('id') id: string, @Body() body: any, @Req() req: AuthedRequest) {
    const content = String(body?.content || '').trim();
    if (!content) throw new BadRequestException('Xabar matni kerak');
    return this.dbAssistant.sendMessage(Number(id), req.user!.id, content);
  }

  @Get('sessions/:id/messages')
  async listMessages(@Param('id') id: string, @Req() req: AuthedRequest) {
    return { messages: await this.dbAssistant.listMessages(Number(id), req.user!.id) };
  }
}

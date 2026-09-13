import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

  @Patch('sessions/:id')
  async renameSession(@Param('id') id: string, @Body() body: any, @Req() req: AuthedRequest) {
    const title = String(body?.title || '').trim();
    if (!title) throw new BadRequestException('Nom kerak');
    return { session: await this.dbAssistant.renameSession(Number(id), req.user!.id, title) };
  }

  @Delete('sessions/:id')
  async deleteSession(@Param('id') id: string, @Req() req: AuthedRequest) {
    await this.dbAssistant.deleteSession(Number(id), req.user!.id);
    return { success: true };
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

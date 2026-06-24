import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'node:path';

@Controller()
export class RootController {
  @Get()
  index(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), '..', 'index.html'));
  }

  @Get('health')
  health() {
    return { ok: true };
  }
}

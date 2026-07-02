import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  async sendMessage(text: string): Promise<void> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_GROUP_ID;
    if (!token || !chatId) return;
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => '');
        this.logger.warn(`Telegram xabar yuborilmadi (${res.status}): ${err.slice(0, 200)}`);
      }
    } catch (err) {
      this.logger.warn(`Telegram fetch xatosi: ${err?.message || err}`);
    }
  }
}

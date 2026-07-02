import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealEntity } from '../../deals/infrastructure/deal.entity';
import { TaskEntity } from '../../tasks/infrastructure/task.entity';
import { AiInsightEntity } from '../infrastructure/ai-insight.entity';

const GEMINI_MODEL = 'gemini-2.0-flash';
const WON_STAGE_ID = 'yutgan';

@Injectable()
export class AiInsightsService {
  private readonly logger = new Logger(AiInsightsService.name);

  constructor(
    @InjectRepository(AiInsightEntity) private readonly insights: Repository<AiInsightEntity>,
    @InjectRepository(DealEntity) private readonly deals: Repository<DealEntity>,
    @InjectRepository(TaskEntity) private readonly tasks: Repository<TaskEntity>
  ) {}

  async list() {
    return this.insights.find({ order: { date: 'DESC' }, take: 60 });
  }

  // Har kuni kechqurun soat 20:00 (Toshkent vaqti) avtomatik ishga tushadi
  @Cron('0 20 * * *', { timeZone: 'Asia/Tashkent' })
  async runScheduled() {
    try {
      await this.generateDaily();
    } catch (err) {
      this.logger.error(`Kunlik AI tahlil avtomatik ishga tushmadi: ${err?.message || err}`);
    }
  }

  async generateDaily() {
    if (!process.env.GEMINI_API_KEY) {
      throw new BadRequestException('GEMINI_API_KEY sozlanmagan — serverga qo‘shilgach AI tahlil ishlay boshlaydi');
    }
    const date = this.todayKey();
    const stats = await this.computeStats(date);
    const previous = await this.insights.findOne({ where: {}, order: { date: 'DESC' } });
    const summary = await this.callGemini(stats, previous?.stats || null, previous?.date || null);
    const existing = await this.insights.findOne({ where: { date } });
    if (existing) {
      existing.stats = stats;
      existing.summary = summary;
      return this.insights.save(existing);
    }
    return this.insights.save(this.insights.create({ date, stats, summary }));
  }

  private async computeStats(today: string) {
    const allDeals = await this.deals.find();
    const allTasks = await this.tasks.find();

    const byStage: Record<string, number> = {};
    let withComments = 0;
    let totalComments = 0;
    let shortComments = 0;
    let lostTotal = 0;
    let lostWithoutComment = 0;
    let newToday = 0;
    let wonToday = 0;

    for (const d of allDeals) {
      byStage[d.stageId] = (byStage[d.stageId] || 0) + 1;
      const comments = d.comments || [];
      if (comments.length) withComments++;
      for (const c of comments) {
        totalComments++;
        const words = String(c?.text || '').trim().split(/\s+/).filter(Boolean).length;
        if (words < 4) shortComments++;
      }
      const isLost = /yutqaz/i.test(d.stageId || '') || /ko'tarmadi|kotarmadi/i.test(d.stageId || '');
      if (isLost) {
        lostTotal++;
        if (!comments.length) lostWithoutComment++;
      }
      if (this.tashkentDay(d.createdAt) === today) newToday++;
      if (d.stageId === WON_STAGE_ID && this.tashkentDay(d.updatedAt) === today) wonToday++;
    }

    const openTasks = allTasks.filter(t => !t.done).length;

    return {
      date: today,
      totalDeals: allDeals.length,
      byStage,
      newToday,
      wonToday,
      commentCoveragePercent: allDeals.length ? Number((withComments / allDeals.length * 100).toFixed(1)) : 0,
      lostTotal,
      lostWithoutComment,
      lostWithoutCommentPercent: lostTotal ? Number((lostWithoutComment / lostTotal * 100).toFixed(1)) : 0,
      totalComments,
      shortComments,
      shortCommentsPercent: totalComments ? Number((shortComments / totalComments * 100).toFixed(1)) : 0,
      totalTasks: allTasks.length,
      openTasks
    };
  }

  private async callGemini(today: any, yesterday: any | null, yesterdayDate: string | null) {
    const prompt = [
      'Sen MyTeacher CRM uchun professional sotuv va marketing tahlilchisan.',
      'Quyida bugungi va (mavjud bo\'lsa) kechagi statistika berilgan. Shu asosda, jamoaga tushunarli, ',
      'qisqa va aniq o\'zbek tilida tahlil yoz: ish sifati kunma-kun yaxshilanyaptimi yoki yomonlashyaptimi, ',
      'eng katta muammo nima, va 2-3 ta amaliy tavsiya bер. 200-300 so\'zdan oshmasin, ortiqcha kirish so\'zlarsiz to\'g\'ridan-to\'g\'ri tahlil bilan boshla.',
      '',
      `BUGUNGI STATISTIKA (${today.date}):`,
      JSON.stringify(today, null, 1),
      yesterday ? `\nOLDINGI TAHLIL (${yesterdayDate}):\n${JSON.stringify(yesterday, null, 1)}` : '\nOldingi kunlik tahlil mavjud emas — bu birinchi tahlil.'
    ].join('\n');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Gemini API xatosi (${res.status}): ${text.slice(0, 300)}`);
    }
    const data: any = await res.json();
    const text = (data.candidates?.[0]?.content?.parts || []).map((part: any) => part.text || '').join('\n').trim();
    if (!text) throw new Error('Gemini API bo‘sh javob qaytardi');
    return text;
  }

  private tashkentDay(value: Date | string | null | undefined) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  }

  private todayKey() {
    return this.tashkentDay(new Date()) as string;
  }
}

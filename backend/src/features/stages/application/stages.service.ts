import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealEntity } from '../../deals/infrastructure/deal.entity';
import { StageEntity } from '../infrastructure/stage.entity';

@Injectable()
export class StagesService {
  private readonly requiredStageIds = ['sotib_olishga_rozi', 'yutgan'];

  constructor(
    @InjectRepository(StageEntity) private readonly stages: Repository<StageEntity>,
    @InjectRepository(DealEntity) private readonly deals: Repository<DealEntity>
  ) {}

  list() {
    return this.stages.find({ order: { sortOrder: 'ASC' } });
  }

  async create(body: any) {
    const label = String(body.label || '').trim();
    if (!label) throw new BadRequestException('Bosqich nomi kerak');
    const count = await this.stages.count();
    return this.stages.save(this.stages.create({
      id: `stage_${Date.now()}`,
      label,
      color: body.color || '#2563EB',
      sortOrder: count
    }));
  }

  async update(id: string, body: any) {
    if (this.requiredStageIds.includes(id)) {
      throw new BadRequestException('Bu bosqich qat’iy, nomi o‘zgarmaydi');
    }
    const stage = await this.stages.findOne({ where: { id } });
    if (!stage) throw new NotFoundException('Bosqich topilmadi');
    const label = String(body.label || '').trim();
    if (!label) throw new BadRequestException('Bosqich nomi kerak');
    stage.label = label;
    if (body.color) stage.color = String(body.color);
    return this.stages.save(stage);
  }

  async delete(id: string) {
    if (this.requiredStageIds.includes(id)) {
      throw new BadRequestException('Bu bosqich qat’iy, o‘chirilmaydi');
    }
    const stage = await this.stages.findOne({ where: { id } });
    if (!stage) throw new NotFoundException('Bosqich topilmadi');
    const dealCount = await this.deals.count({ where: { stageId: id } });
    if (dealCount) throw new BadRequestException('Oldin bu bosqichdagi shartnomalarni ko‘chiring');
    await this.stages.delete(id);
  }
}

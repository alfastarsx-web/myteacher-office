import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StageEntity } from '../infrastructure/stage.entity';

@Injectable()
export class StagesService {
  constructor(@InjectRepository(StageEntity) private readonly stages: Repository<StageEntity>) {}

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
}

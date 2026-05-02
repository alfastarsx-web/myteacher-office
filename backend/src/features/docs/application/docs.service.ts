import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { DocEntity, DocType } from '../infrastructure/doc.entity';

@Injectable()
export class DocsService {
  constructor(@InjectRepository(DocEntity) private readonly docs: Repository<DocEntity>) {}

  list() {
    return this.docs.find({ order: { id: 'DESC' } });
  }

  create(body: any, user: UserEntity) {
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Hujjat nomi kerak');
    const allowed = ['guide', 'script', 'resume'];
    const type = (allowed.includes(body.type) ? body.type : 'guide') as DocType;
    return this.docs.save(this.docs.create({
      type,
      title,
      description: String(body.description || '').trim(),
      author: String(body.author || user.name || 'Admin'),
      fileName: String(body.fileName || '').trim() || undefined,
      fileData: String(body.fileData || '').startsWith('data:application/pdf') ? String(body.fileData) : undefined
    }));
  }
}

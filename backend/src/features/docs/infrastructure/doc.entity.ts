import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type DocType = 'guide' | 'script' | 'resume';

@Entity('docs')
export class DocEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'guide' })
  type: DocType;

  @Column()
  title: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: 'Admin' })
  author: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ type: 'text', nullable: true })
  fileData?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

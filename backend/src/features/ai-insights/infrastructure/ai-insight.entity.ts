import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ai_insights')
export class AiInsightEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Tashkent kalendar kuni, YYYY-MM-DD — kun uchun bitta tahlil
  @Column({ unique: true })
  date: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'jsonb' })
  stats: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}

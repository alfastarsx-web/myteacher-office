import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('stages')
export class StageEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  label: string;

  @Column({ default: '#2563EB' })
  color: string;

  @Column({ default: 0 })
  sortOrder: number;
}

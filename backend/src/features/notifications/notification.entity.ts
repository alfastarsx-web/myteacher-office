import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // kim uchun

  @Column()
  type: string; // deal_assigned | task_created | comment_added | stage_changed

  @Column()
  title: string;

  @Column({ type: 'text', default: '' })
  body: string;

  @Column({ nullable: true })
  dealId: number | null;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  fromUserId: number | null; // kim yubordi

  @CreateDateColumn()
  createdAt: Date;
}

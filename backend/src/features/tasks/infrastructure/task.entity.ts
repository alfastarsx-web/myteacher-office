import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/infrastructure/user.entity';

// dealId — hasOpenTaskForDeal/reassignDealTasks (har bosqich o'zgarishда), ownerId — list()
// bo'yicha so'raladi. Indekssiz butun tasks jadvali skanlanadi.
@Entity('tasks')
@Index(['dealId'])
@Index(['ownerId'])
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  dealId?: number;

  @ManyToOne(() => UserEntity, user => user.tasks, { eager: false })
  owner: UserEntity;

  @Column()
  ownerId: number;

  @Column()
  title: string;

  @Column({ default: 'Bugun' })
  due: string;

  @Column({ default: false })
  done: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

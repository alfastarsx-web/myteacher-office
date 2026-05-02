import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RefreshTokenEntity } from '../../auth/infrastructure/refresh-token.entity';
import { DealEntity } from '../../deals/infrastructure/deal.entity';
import { TaskEntity } from '../../tasks/infrastructure/task.entity';
import { UserRole } from '../domain/user-role.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Manager })
  role: UserRole;

  @Column({ default: 'Offline' })
  status: string;

  @Column({ default: 'MT' })
  avatar: string;

  @Column({ default: 'linear-gradient(135deg,#93c5fd,#3b82f6)' })
  color: string;

  @OneToMany(() => DealEntity, deal => deal.owner)
  deals: DealEntity[];

  @OneToMany(() => TaskEntity, task => task.owner)
  tasks: TaskEntity[];

  @OneToMany(() => RefreshTokenEntity, token => token.user)
  refreshTokens: RefreshTokenEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

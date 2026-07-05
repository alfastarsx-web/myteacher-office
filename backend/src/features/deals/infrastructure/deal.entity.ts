import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/infrastructure/user.entity';

@Entity('deals')
export class DealEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column({ default: '' })
  dealName: string;

  @Column({ default: '' })
  phone: string;

  @Column({ type: 'text', array: true, default: '{}' })
  phones: string[];

  @Column({ default: 'yangi' })
  stageId: string;

  @Column({ type: 'bigint', default: 0 })
  price: number;

  @Column({ type: 'text', default: '' })
  note: string;

  @Column({ default: '' })
  adSource: string;

  @Column({ default: '' })
  registeredAt: string;

  @Column({ nullable: true })
  age: number | null;

  @Column({ type: 'text', default: '' })
  learningGoal: string;

  @Column({ default: '' })
  leadChannel: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  comments: Array<{ text: string; from: string; time: string }>;

  @ManyToOne(() => UserEntity, user => user.deals, { eager: false, nullable: true })
  owner: UserEntity;

  @Column({ nullable: true })
  ownerId: number | null;

  @Column({ nullable: true })
  operatorId: number | null;
  @Column({ default: false })
  appInstalled: boolean;
  @Column({ nullable: true, type: 'varchar' })
  appInstalledAt: string | null;
  @Column({ nullable: true, type: 'varchar' })
  qualAt: string | null;
  @Column({ default: false })
  fullCall: boolean;
  @Column({ nullable: true, type: 'varchar' })
  fullCallAt: string | null;
  @Column({ default: false })
  sentToManager: boolean;
  @Column({ nullable: true, type: 'int' })
  courseDuration: number | null;
  @Column({ nullable: true, type: 'varchar' })
  paymentType: string | null;
  @Column({ nullable: true, type: 'varchar' })
  lostFromStage: string | null;
  // Qisman to'lov: to'langan jami summa va to'lovlar tarixi
  @Column({ type: 'bigint', default: 0 })
  paidAmount: number;
  @Column({ type: 'jsonb', default: () => "'[]'" })
  payments: Array<{ amount: number; method: string; at: string; by: number }>;
  // Operator "sotuv oynasi" shu sanaga qarab o'lchanadi (birinchi to'lov = mijoz joy band qildi)
  @Column({ nullable: true, type: 'varchar' })
  firstPaymentAt: string | null;
  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment_adjustments')
export class PaymentAdjustmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // null = barcha menejerlarga taalluqli (umumiy bonus/jarima), aks holda faqat shu menejerga
  @Column({ nullable: true })
  managerId: number | null;

  // musbat = bonus, manfiy = jarima
  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'text' })
  reason: string;

  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;
}

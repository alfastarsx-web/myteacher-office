import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DbAssistantRole {
  User = 'user',
  Model = 'model'
}

@Entity('db_assistant_messages')
export class DbAssistantMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: number;

  @Column({ type: 'enum', enum: DbAssistantRole })
  role: DbAssistantRole;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  sql: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

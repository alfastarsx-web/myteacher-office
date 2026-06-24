import type { Request } from 'express';
import type { UserEntity } from './features/users/infrastructure/user.entity';

export type UserRole = 'admin' | 'manager';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: string;
  avatar: string;
  color: string;
  todayOnlineSeconds?: number;
  onlineDay?: string | null;
  onlineStartedAt?: Date | null;
}

export interface Stage {
  id: string;
  label: string;
  color: string;
}

export interface Deal {
  id: number;
  customerName: string;
  dealName: string;
  phone: string;
  phones: string[];
  stageId: string;
  price: number;
  note: string;
  ownerId: number | null;
  createdBy: number;
  createdAt: string;
}

export interface Task {
  id: number;
  dealId: number | null;
  ownerId: number;
  title: string;
  due: string;
  done: boolean;
  createdAt: string;
}

export interface Doc {
  id: number;
  type: 'guide' | 'script' | 'resume';
  title: string;
  description: string;
  author: string;
  updatedAt: string;
  fileName?: string;
  fileData?: string;
}

export interface DbShape {
  users: User[];
  stages: Stage[];
  deals: Deal[];
  tasks: Task[];
  docs: Doc[];
  nextIds: {
    user: number;
    deal: number;
    task: number;
    doc: number;
  };
}

export interface AuthedRequest extends Request {
  user?: UserEntity;
}

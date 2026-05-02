import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DealEntity } from '../../features/deals/infrastructure/deal.entity';
import { DocEntity } from '../../features/docs/infrastructure/doc.entity';
import { StageEntity } from '../../features/stages/infrastructure/stage.entity';
import { TaskEntity } from '../../features/tasks/infrastructure/task.entity';
import { RefreshTokenEntity } from '../../features/auth/infrastructure/refresh-token.entity';
import { UserEntity } from '../../features/users/infrastructure/user.entity';

export function typeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'myteacher_crm',
    entities: [UserEntity, RefreshTokenEntity, StageEntity, DealEntity, TaskEntity, DocEntity],
    synchronize: process.env.TYPEORM_SYNC !== 'false',
    logging: process.env.TYPEORM_LOGGING === 'true'
  };
}

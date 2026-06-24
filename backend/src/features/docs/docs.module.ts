import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DocsService } from './application/docs.service';
import { DocEntity } from './infrastructure/doc.entity';
import { DocsController } from './presentation/docs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DocEntity]), AuthModule],
  controllers: [DocsController],
  providers: [DocsService]
})
export class DocsModule {}

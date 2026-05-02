import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '../../common/crypto/password.service';
import { UserEntity } from './infrastructure/user.entity';
import { UsersService } from './application/users.service';
import { UsersController } from './presentation/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
  exports: [UsersService]
})
export class UsersModule {}

import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '../../common/crypto/password.service';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/auth.service';
import { RefreshTokenEntity } from './infrastructure/refresh-token.entity';
import { AdminGuard } from './presentation/admin.guard';
import { AuthController } from './presentation/auth.controller';
import { JwtAuthGuard } from './presentation/jwt-auth.guard';

@Global()
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([RefreshTokenEntity]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, AdminGuard, PasswordService],
  exports: [AuthService, JwtAuthGuard, AdminGuard, PasswordService]
})
export class AuthModule {}

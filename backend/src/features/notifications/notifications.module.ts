import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationEntity } from './notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error(
    'JWT_ACCESS_SECRET environment variable is not set. Refusing to start the server with an insecure default secret — set JWT_ACCESS_SECRET in your .env before starting.'
  );
}

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET
    })
  ],
  controllers: [NotificationsController],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway]
})
export class NotificationsModule {}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../users/domain/user-role.enum';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { PaymentAdjustmentEntity } from '../infrastructure/payment-adjustment.entity';

@Injectable()
export class PaymentAdjustmentsService {
  constructor(
    @InjectRepository(PaymentAdjustmentEntity) private readonly adjustments: Repository<PaymentAdjustmentEntity>
  ) {}

  async listFor(user: UserEntity) {
    if (user.role === UserRole.Admin || user.permissions?.all === true) {
      return this.adjustments.find({ order: { createdAt: 'DESC' } });
    }
    return this.adjustments
      .createQueryBuilder('adj')
      .where('adj.managerId = :id OR adj.managerId IS NULL', { id: user.id })
      .orderBy('adj.createdAt', 'DESC')
      .getMany();
  }

  async create(body: any, admin: UserEntity) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount === 0) {
      throw new BadRequestException('Summani kiriting (musbat = bonus, manfiy = jarima)');
    }
    const reason = String(body.reason || '').trim();
    if (!reason) throw new BadRequestException('Sabab kiritilishi shart');
    return this.adjustments.save(
      this.adjustments.create({
        managerId: body.managerId ? Number(body.managerId) : null,
        amount,
        reason,
        createdBy: admin.id
      })
    );
  }

  async delete(id: number) {
    const row = await this.adjustments.findOne({ where: { id: Number(id) } });
    if (!row) throw new NotFoundException('Yozuv topilmadi');
    await this.adjustments.delete(row.id);
    return { ok: true };
  }
}

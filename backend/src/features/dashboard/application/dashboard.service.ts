import { Injectable } from '@nestjs/common';
import { DealsService } from '../../deals/application/deals.service';
import { UsersService } from '../../users/application/users.service';
import { UserRole } from '../../users/domain/user-role.enum';
import { UserEntity } from '../../users/infrastructure/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    private readonly deals: DealsService,
    private readonly users: UsersService
  ) {}

  async summary(user: UserEntity) {
    const deals = await this.deals.list(user);
    const today = new Date().toISOString().slice(0, 10);
    const todayCash = deals
      .filter(deal => String(deal.createdAt || '').slice(0, 10) === today)
      .reduce((sum, deal) => sum + Number(deal.price || 0), 0);
    const allCash = deals.reduce((sum, deal) => sum + Number(deal.price || 0), 0);
    const activeDeals = deals.filter(deal => !['yutgan', 'yutqazilgan'].includes(deal.stageId));
    const wonCash = deals.filter(deal => deal.stageId === 'yutgan').reduce((sum, deal) => sum + Number(deal.price || 0), 0);
    const todaySalary = Math.round(todayCash * 0.1);
    const team = await this.users.listFor(user);
    const monthlySalary = user.role === UserRole.Admin
      ? team.reduce((sum, item: any) => sum + (item.role === UserRole.Admin ? 15000000 : 10000000), 0)
      : 10000000;
    const target = 1500000000;
    return {
      todayCash,
      todaySalary,
      monthlySalary,
      missedDealAmount: Math.max(0, target - allCash),
      allCash,
      wonCash,
      target,
      activeDeals: activeDeals.length,
      dealCount: deals.length
    };
  }
}

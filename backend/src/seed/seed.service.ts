import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from '../common/crypto/password.service';
import { DealEntity } from '../features/deals/infrastructure/deal.entity';
import { DocEntity } from '../features/docs/infrastructure/doc.entity';
import { StageEntity } from '../features/stages/infrastructure/stage.entity';
import { TaskEntity } from '../features/tasks/infrastructure/task.entity';
import { UserRole } from '../features/users/domain/user-role.enum';
import { UserEntity } from '../features/users/infrastructure/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    @InjectRepository(StageEntity) private readonly stages: Repository<StageEntity>,
    @InjectRepository(DealEntity) private readonly deals: Repository<DealEntity>,
    @InjectRepository(TaskEntity) private readonly tasks: Repository<TaskEntity>,
    @InjectRepository(DocEntity) private readonly docs: Repository<DocEntity>,
    private readonly passwords: PasswordService
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SEED_DEMO === 'false') return;
    await this.seedUsers();
    await this.seedStages();
    await this.seedDeals();
    await this.seedTasks();
    await this.seedDocs();
  }

  private async seedUsers() {
    if (await this.users.count()) return;
    await this.users.save([
      this.users.create({
        name: 'Admin',
        email: 'admin@myteacher.uz',
        passwordHash: this.passwords.hash('admin12345'),
        role: UserRole.Admin,
        status: 'Online',
        avatar: 'AD',
        color: 'linear-gradient(135deg,#2563eb,#1d4ed8)'
      }),
      this.users.create({
        name: 'Diyora Shomamatova',
        email: 'diyora@myteacher.uz',
        passwordHash: this.passwords.hash('manager12345'),
        role: UserRole.Manager,
        status: 'Online',
        avatar: 'DS',
        color: 'linear-gradient(135deg,#f9a8d4,#ec4899)'
      })
    ]);
  }

  private async seedStages() {
    if (await this.stages.count()) return;
    await this.stages.save([
      { id: 'yangi', label: 'Yangi', color: '#2563EB', sortOrder: 1 },
      { id: 'malakali', label: 'Malakali', color: '#A855F7', sortOrder: 2 },
      { id: 'taklif', label: 'Taklif berilgan', color: '#F59E0B', sortOrder: 3 },
      { id: 'muzokaralar', label: 'Muzokaralar', color: '#22C55E', sortOrder: 4 },
      { id: 'sotib_olishga_rozi', label: 'Sotib olishga rozi', color: '#0EA5E9', sortOrder: 5 },
      { id: 'yutqazilgan', label: 'Yutqazilgan', color: '#EF4444', sortOrder: 6 },
      { id: 'yutgan', label: 'Muvaffaqiyatli', color: '#10B981', sortOrder: 7 }
    ]);
  }

  private async seedDeals() {
    if (await this.deals.count()) return;
    const admin = await this.users.findOneBy({ email: 'admin@myteacher.uz' });
    const manager = await this.users.findOneBy({ email: 'diyora@myteacher.uz' });
    if (!admin || !manager) return;
    await this.deals.save([
      this.deals.create({
        customerName: 'John Smith',
        dealName: "Sovg'a #5",
        phone: '+998 90 123 45 67',
        phones: ['+998 90 123 45 67'],
        stageId: 'yangi',
        price: 4990000,
        ownerId: manager.id,
        createdBy: admin.id
      }),
      this.deals.create({
        customerName: 'Test Chat',
        dealName: 'Shartnoma 2',
        phone: '+998 95 255 25 66',
        phones: ['+998 95 255 25 66'],
        stageId: 'taklif',
        price: 1250000,
        ownerId: manager.id,
        createdBy: admin.id
      })
    ]);
  }

  private async seedTasks() {
    if (await this.tasks.count()) return;
    const manager = await this.users.findOneBy({ email: 'diyora@myteacher.uz' });
    if (!manager) return;
    await this.tasks.save(this.tasks.create({
      dealId: 1,
      ownerId: manager.id,
      title: "A1 guruh o'quvchilariga video chat",
      due: 'Bugun, 18:00',
      done: false
    }));
  }

  private async seedDocs() {
    if (await this.docs.count()) return;
    await this.docs.save([
      { type: 'guide', title: "Yangi menejer uchun yo'riqnoma", description: 'CRMga kirish, mijoz kartochkasi, vazifa va shartnoma bilan ishlash tartibi.', author: 'Admin' },
      { type: 'script', title: "Birinchi qo'ng'iroq skripti", description: "Ota-ona bilan salomlashish, ehtiyojni aniqlash va darsga yozishga olib keladigan suhbat oqimi.", author: 'Admin' },
      { type: 'resume', title: 'Maslahatchi mutaxassis resume namunasi', description: 'Ishga qabul qilishda ishlatiladigan qisqa, toza va MyTeacher uslubidagi resume shakli.', author: 'Admin' }
    ]);
  }
}

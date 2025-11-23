import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../db/entities/admin.entity';
import { WalletTransaction } from '../db/entities/transaction.entity';
import { User } from '../db/entities/user.entity';
import { Wallet } from '../db/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, WalletTransaction, User, Wallet])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

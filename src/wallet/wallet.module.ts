import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../db/entities/wallet.entity';
import { User } from '../db/entities/user.entity';
import { Currency } from '../db/entities/currency.entity';
import { WalletTransaction } from '../db/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, User, Currency, WalletTransaction]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}

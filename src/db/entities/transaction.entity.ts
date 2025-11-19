import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CurrencySymbol,
  WalletTransactionOperation,
} from '../../common/constants/types.enum';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: WalletTransactionOperation,
  })
  operation: WalletTransactionOperation;

  @Column('float')
  originalAmount: number;

  @Column('float')
  fee: number;

  @Column('float')
  finalAmount: number;

  @Column('float')
  previousBalance: number;

  @Column('float')
  currentBalance: number;

  @Column({ type: 'enum', enum: CurrencySymbol })
  currency: CurrencySymbol;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

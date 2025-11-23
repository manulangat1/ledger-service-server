import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CurrencySymbol,
  WalletTransactionOperation,
  WalletTransactionSource,
  WalletTransactionStatus,
} from '../../common/constants/types.enum';
import { Wallet } from './wallet.entity';

@Entity()
@Index(['source', 'status', 'operation'])
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: WalletTransactionOperation,
  })
  operation: WalletTransactionOperation;

  @Column({
    type: 'enum',
    enum: WalletTransactionSource,
  })
  source: WalletTransactionSource;

  @Column({
    type: 'enum',
    enum: WalletTransactionStatus,
  })
  status: WalletTransactionStatus;

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

  @Column({ unique: true })
  idempotencyKey: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

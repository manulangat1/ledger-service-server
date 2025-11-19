import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PocketStatus } from '../../common/constants/types.enum';
import { User } from './user.entity';
import { Currency } from './currency.entity';
import { WalletTransaction } from './transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  balance: number;

  @Column({
    type: 'enum',
    enum: PocketStatus,
    default: PocketStatus.ACTIVE,
  })
  status: PocketStatus;

  @Index()
  @ManyToOne(() => User, (user) => user.wallets, {
    nullable: false,
  })
  user: User;

  @Index()
  @ManyToOne(() => Currency, (currency) => currency.wallets)
  currency: Currency;

  @ManyToOne(
    () => WalletTransaction,
    (walletTransaction) => walletTransaction.wallet,
  )
  transactions: WalletTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

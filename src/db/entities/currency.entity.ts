import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column()
  minimumTopUpAmount: number;

  @Column()
  maximumWithdrawableAmount: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  alias: string;

  @OneToMany(() => Wallet, (wallet) => wallet.currency)
  wallets: Wallet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

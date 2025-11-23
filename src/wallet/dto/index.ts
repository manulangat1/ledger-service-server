// TODO: move this to appopriate named file

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../../db/entities/user.entity';
import { Currency } from '../../db/entities/currency.entity';
import { Wallet } from '../../db/entities/wallet.entity';
import {
  WalletTransactionOperation,
  WalletTransactionSource,
  WalletTransactionStatus,
} from '../../common/constants/types.enum';

export class CompleteWalletTransactionDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  currency: Currency;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  fee: number;

  @IsNotEmpty()
  wallet: Wallet;

  @IsEnum(WalletTransactionSource)
  walletTransactionSource: WalletTransactionSource;

  @IsEnum(WalletTransactionOperation)
  walletTransactionOperation: WalletTransactionOperation;

  @IsEnum(WalletTransactionStatus)
  walletTransactionStatus: WalletTransactionStatus;

  @IsNotEmpty()
  @IsString()
  idempotencyKey: string;
}

import { EntityManager } from 'typeorm';
import { Wallet } from '../../db/entities/wallet.entity';
import {
  CurrencySymbol,
  WalletTransactionOperation,
  WalletTransactionSource,
  WalletTransactionStatus,
} from '../../common/constants/types.enum';
import { CompleteWalletTransactionDto } from '../dto';
import { BadRequestException } from '@nestjs/common';
import { parseToNumberWithDecimals } from '../../common/utils/fetchRecordCount';
import { WalletTransaction } from '../../db/entities/transaction.entity';

/**
 * Update user's wallet balance if there is a movement (debit/credit) happens within that wallet.
 *
 * @param manager Entity Transaction Manager
 * @param data payload
 * @returns { Wallet } Updated wallet.
 */
export const updateWalletDetails = async (
  manager: EntityManager,
  data: CompleteWalletTransactionDto,
): Promise<Wallet | void> => {
  const {
    amount,
    currency,
    wallet,
    user,
    walletTransactionStatus,
    walletTransactionOperation,
    walletTransactionSource,
    idempotencyKey,
    fee,
  } = data;

  let applicableFee = 0;
  // TODO: calculate the fees from here.
  //   if ( )

  const previousBalance = wallet.balance || 0;
  const finalAmount = amount - applicableFee;

  let walletCurrentBalance =
    walletTransactionOperation === WalletTransactionOperation.DEBIT
      ? previousBalance + amount
      : previousBalance - finalAmount;

  // For a top up transaction with status as PENDING, the pocket balance will remain as the same

  if (
    walletTransactionSource === WalletTransactionSource.TOP_UP &&
    walletTransactionStatus === WalletTransactionStatus.PENDING
  ) {
    walletCurrentBalance = previousBalance;
  }
  //   TODO: check that this is on deposit only.
  if (
    walletTransactionOperation === WalletTransactionOperation.CREDIT &&
    walletCurrentBalance < 0
  ) {
    throw new BadRequestException('Wallet has insufficient balance');
  }

  const walletData: Wallet = manager.create(Wallet, {
    ...wallet,
    user,
    currency,
    balance: parseToNumberWithDecimals(walletCurrentBalance, 6),
  });
  const updatedWallet = await manager.save(walletData);

  const walletTransaction: WalletTransaction = manager.create(
    WalletTransaction,
    {
      source: walletTransactionSource,
      operation: walletTransactionOperation,
      status: walletTransactionStatus,
      originalAmount: parseToNumberWithDecimals(amount, 6),
      finalAmount: parseToNumberWithDecimals(finalAmount, 6),
      currency: currency.currency as CurrencySymbol,
      currentBalance: parseToNumberWithDecimals(walletCurrentBalance, 6),
      previousBalance: parseToNumberWithDecimals(previousBalance, 6),
      wallet: updatedWallet,
      fee,
      idempotencyKey,
    },
  );
  await manager.save(WalletTransaction, walletTransaction);

  return updatedWallet;
};

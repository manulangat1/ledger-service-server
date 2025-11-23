import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../db/entities/admin.entity';
import { Repository } from 'typeorm';
import { WalletTransaction } from '../db/entities/transaction.entity';
import { TransactionQueriesDto } from '../wallet/dto/transaction-queries.dto';
import { dataResponse, DataResponseDTO } from '../common/dto/data-response.dto';
import { User } from '../db/entities/user.entity';
import { Wallet } from '../db/entities/wallet.entity';
import {
  PocketStatus,
  WalletTransactionOperation,
  WalletTransactionSource,
} from '../common/constants/types.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async findByEmailWithSelect(email: string): Promise<Admin | null> {
    const emailExists = await this.adminRepository.findOne({
      where: {
        email,
      },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'password',
        'salt',
        'createdAt',
        'updatedAt',
      ],
    });
    return emailExists;
  }

  async fetchAllTransaction(
    admin: Admin,
    queries: TransactionQueriesDto,
  ): Promise<DataResponseDTO> {
    const { source, status, operation } = queries;
    const queryBuilder = await this.walletTransactionRepository
      .createQueryBuilder('transactions')
      .orderBy('transactions.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('transactions.status = :status', { status });
    }
    if (source) {
      queryBuilder.andWhere('transactions.source = :source', { source });
    }
    if (operation) {
      queryBuilder.andWhere('transactions.operation = :operation', {
        operation,
      });
    }

    const transactions = await queryBuilder.getMany();
    return dataResponse(transactions);
  }

  async loadStatistics() {
    const [
      totalUsers,
      activeWalletBalanceResult,
      totalWithdrawals,
      totalTransferDebits,
    ] = await Promise.all([
      this.userRepository.count(),

      this.walletRepository
        .createQueryBuilder('wallet')
        .select('SUM(wallet.balance)', 'total')
        .where('wallet.status = :status', { status: PocketStatus.ACTIVE })
        .getRawOne(),

      this.walletTransactionRepository.count({
        where: { source: WalletTransactionSource.WITHDRAW },
      }),

      this.walletTransactionRepository.count({
        where: {
          source: WalletTransactionSource.TRANSFER,
          operation: WalletTransactionOperation.DEBIT,
        },
      }),
    ]);

    const sumActiveWallets = Number(activeWalletBalanceResult.total) || 0;

    return {
      totalUsers,
      sumActiveWallets,
      totalWithdrawals,
      totalTransferDebits,
    };
  }
}

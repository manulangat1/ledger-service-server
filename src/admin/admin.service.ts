import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../db/entities/admin.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { WalletTransaction } from '../db/entities/transaction.entity';
import { TransactionQueriesDto } from '../wallet/dto/transaction-queries.dto';
import { dataResponse, DataResponseDTO } from '../common/dto/data-response.dto';
import { User } from '../db/entities/user.entity';
import { Wallet } from '../db/entities/wallet.entity';
import {
  CurrencySymbol,
  PocketStatus,
  WalletTransactionOperation,
  WalletTransactionSource,
} from '../common/constants/types.enum';
import {
  CreateUserByAdminDto,
  CreateUserDto,
} from '../user/dto/create-user.dto';
import { Currency } from '../db/entities/currency.entity';

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
    private dataSource: DataSource,
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

  async addUser(dto: CreateUserByAdminDto): Promise<DataResponseDTO> {
    const { email, firstName, lastName, username } = dto;

    const user = await this.dataSource.transaction(
      async (manager: EntityManager): Promise<User> => {
        const userExists = await manager.findOne(User, {
          where: {
            email,
          },
        });
        if (userExists)
          throw new BadRequestException('User with email already exists');
        const password = 'Password@1';

        const user = await manager.create(User, {
          email,
          firstName,
          lastName,
          username,
          password,
        });
        await manager.save(user);

        const defaultCurrency = await manager.findOne(Currency, {
          where: {
            currency: CurrencySymbol.KENYAN,
            // currency: 'KES',
          },
        });

        if (!defaultCurrency) throw new NotFoundException('Currency not found');

        // create the wallet here.

        const wallet = await manager.create(Wallet, {
          user,
          balance: 0,
          currency: defaultCurrency,
        });

        await manager.save(wallet);

        return user;
      },
    );
    return dataResponse(user);
  }
}

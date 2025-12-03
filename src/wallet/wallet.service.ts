import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../db/entities/wallet.entity';
import { DataSource, EntityManager, FindOneOptions, Repository } from 'typeorm';
import { User } from '../db/entities/user.entity';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { Currency } from '../db/entities/currency.entity';
import { _400, _404 } from '../common/constants/error_messages';
import { dataResponse, DataResponseDTO } from '../common/dto/data-response.dto';
import { WalletTopUpDTo, WalletWithdrawDTO } from './dto/wallet-withdraw.dto';
import { OkResponse, okResponse } from '../common/dto/ok-response.dto';
import { updateWalletDetails } from './utils';
import {
  WalletTransactionOperation,
  WalletTransactionSource,
  WalletTransactionStatus,
} from '../common/constants/types.enum';
import { WalletTransaction } from '../db/entities/transaction.entity';
import { TransferMoneyDTO } from './dto/transfer-money.dto';
import { TransactionQueriesDto } from './dto/transaction-queries.dto';
import { calculateOffset } from '../common/utils/getLimitOffset';

@Injectable()
export class WalletService {
  private readonly logger = new Logger('Wallet');
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    private dataSource: DataSource,
  ) {}

  async getUserWallet(user: User) {
    this.logger.log(`Fetching wallets for the user ${user.id}`);

    const wallets = await this.walletRepository.find({
      where: {
        user: { id: user.id },
      },
    });
    return wallets;
  }
  async create(user: User, dto: CreateWalletDTO): Promise<DataResponseDTO> {
    // get the user
    const { currency } = dto;
    const currencyExists = await this.currencyRepository.findOne({
      where: {
        currency,
      },
    });

    if (!currencyExists)
      throw new BadRequestException(_404.CURRENCY_UNSUPPORTED);
    const walletExists = await this.walletRepository.findOne({
      where: {
        user: { id: user.id },
        currency: currencyExists,
      },
    });

    if (walletExists) throw new BadRequestException(_400.WALLET_EXISTS);

    const wallet = await this.dataSource.transaction(async (manager) => {
      const wallet = await manager.create(Wallet, {
        user,
        currency: currencyExists,
        balance: 0,
      });
      await manager.save(wallet);
      return wallet;
    });

    return dataResponse(wallet);
  }

  async withdraw(
    walletId: number,
    user: User,
    dto: WalletWithdrawDTO,
  ): Promise<OkResponse> {
    await this.dataSource.transaction(
      async (manager: EntityManager): Promise<void> => {
        const { amount, idempotencyKey } = dto;

        // idempotency check.
        const existingTransaction =
          await this.walletTransactionRepository.exists({
            where: {
              idempotencyKey,
            },
          });

        if (existingTransaction)
          throw new BadRequestException(
            'A similar transaction is being processed!',
          );

        // lock the wallet row to avoude double deduction.
        const wallet = await manager.findOne(Wallet, {
          where: {
            id: walletId,
            user: { id: user.id },
          },

          lock: { mode: 'pessimistic_write' },
        });

        const currency = await manager
          .createQueryBuilder()
          .relation(Wallet, 'currency')
          .of(wallet)
          .loadOne();

        if (!wallet) throw new BadRequestException(_404.WALLET_DOES_NOT_EXIST);

        if (amount > wallet.balance) {
          throw new BadRequestException(_400.WALLET_HAS_INSUFFICIENT_BALANCE);
        }

        if (amount > currency.maximumWithdrawableAmount)
          throw new BadRequestException('Amount is less than required');

        await updateWalletDetails(manager, {
          user,
          currency: currency,
          amount,
          fee: 0,
          wallet,
          walletTransactionSource: WalletTransactionSource.WITHDRAW,
          walletTransactionOperation: WalletTransactionOperation.CREDIT,
          walletTransactionStatus: WalletTransactionStatus.COMPLETED,
          idempotencyKey,
        });
      },
    );
    return okResponse('Wallet withdraw request has been made successfully.');
  }

  async topUp(walletId: number, user: User, dto: WalletTopUpDTo) {
    await this.dataSource.transaction(
      async (manager: EntityManager): Promise<void> => {
        // check whether wallet exists.
        const { amount, idempotencyKey } = dto;

        // idempotency check.
        const existingTransaction =
          await this.walletTransactionRepository.findOne({
            where: {
              idempotencyKey,
            },
          });

        if (existingTransaction)
          throw new BadRequestException(
            'A similar transaction is being processed!',
          );

        // lock the wallet row to avoid double deduction.
        const wallet = await manager.findOne(Wallet, {
          where: {
            id: walletId,
            user: { id: user.id },
          },

          lock: { mode: 'pessimistic_write' },
        });

        const currency = await manager
          .createQueryBuilder()
          .relation(Wallet, 'currency')
          .of(wallet)
          .loadOne();

        if (!wallet) throw new BadRequestException(_404.WALLET_DOES_NOT_EXIST);
        if (amount < currency.minimumTopUpAmount)
          throw new BadRequestException(
            'Amount less than required topup amaount',
          );
        await updateWalletDetails(manager, {
          user,
          currency: currency,
          amount,
          fee: 0,
          wallet,
          walletTransactionSource: WalletTransactionSource.TOP_UP,
          walletTransactionOperation: WalletTransactionOperation.DEBIT,
          walletTransactionStatus: WalletTransactionStatus.COMPLETED,
          idempotencyKey,
        });
      },
    );
    return okResponse('Wallet top up request has been made successfully.');
  }

  async transferBetweenWallets(
    walletId: number,
    user: User,
    dto: TransferMoneyDTO,
  ): Promise<OkResponse> {
    this.logger.log(`Initiating money transfer`);

    const transfer = await this.dataSource.transaction(
      async (manager: EntityManager): Promise<void> => {
        const { amount, idempotencyKey, currency, username } = dto;
        // idempotency check.
        const existingTransaction =
          await this.walletTransactionRepository.findOne({
            where: {
              idempotencyKey,
            },
          });

        if (existingTransaction)
          throw new BadRequestException(
            'A similar transaction is being processed!',
          );

        const destinationUserExists = await manager.findOne(User, {
          where: {
            username,
          },
          lock: { mode: 'pessimistic_write' },
        });
        if (!destinationUserExists)
          throw new NotFoundException('User does not exist');

        // throw an error if the source and destination Wallets are the same
        if (user.username === destinationUserExists.username)
          throw new BadRequestException(
            'You cannot transfer money to yourself.',
          );

        const destinationWallet = await manager.findOne(Wallet, {
          where: {
            user: { id: destinationUserExists.id },
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (!destinationWallet)
          throw new NotFoundException(_404.WALLET_DOES_NOT_EXIST);

        const sourceWallet = await manager.findOne(Wallet, {
          where: {
            id: walletId,
            user: { id: user.id },
          },

          lock: { mode: 'pessimistic_write' },
        });

        if (!sourceWallet)
          throw new BadRequestException(_404.WALLET_DOES_NOT_EXIST);

        await this.handleTransfersBetweenTwoWallets(
          manager,
          user,
          sourceWallet,
          amount,
          destinationWallet,
          idempotencyKey,
          destinationUserExists,
        );
      },
    );

    return okResponse('The transfer request has been made successfully!');
  }

  async findOneWallet(options: FindOneOptions<Wallet>) {
    return await this.walletRepository.findOne(options);
  }

  /**
   * Transfer money between two wallets.
   * NOTE:
   * @param manager Entity manager
   * @param user Authenticated user
   * @param sourceWallet User's pocker
   * @param transferredAmount Amount to be transferred.
   * @param destinationWallet Wallet of user to be sent to.
   */

  private async handleTransfersBetweenTwoWallets(
    manager: EntityManager,
    user: User,
    sourceWallet: Wallet,
    transferredAmount: number,
    destinationWallet: Wallet,
    idempotencyKey: string,
    destinationUser: User,
  ): Promise<void> {
    // update source wallet details.

    const [sourceCurrency, destinationCurrency] = await Promise.all([
      manager
        .createQueryBuilder()
        .relation(Wallet, 'currency')
        .of(sourceWallet)
        .loadOne(),
      manager
        .createQueryBuilder()
        .relation(Wallet, 'currency')
        .of(destinationWallet)
        .loadOne(),
    ]);

    const sourceWalletAfterCredit = await updateWalletDetails(manager, {
      user,
      wallet: sourceWallet,
      fee: 0,
      currency: sourceCurrency,
      walletTransactionOperation: WalletTransactionOperation.CREDIT,
      walletTransactionSource: WalletTransactionSource.TRANSFER,
      walletTransactionStatus: WalletTransactionStatus.COMPLETED,
      amount: transferredAmount,
      idempotencyKey,
    });

    const destinationWalletAfterDebit = await updateWalletDetails(manager, {
      // TODO: fix this
      user: destinationUser,
      wallet: destinationWallet,
      fee: 0,
      currency: destinationCurrency,
      walletTransactionOperation: WalletTransactionOperation.DEBIT,
      walletTransactionSource: WalletTransactionSource.TRANSFER,
      walletTransactionStatus: WalletTransactionStatus.COMPLETED,
      amount: transferredAmount,
      idempotencyKey: crypto.randomUUID(),
    });
  }

  async loadAllWalletTransactions(
    walletId: number,
    user: User,
    queries: TransactionQueriesDto,
  ): Promise<DataResponseDTO> {
    const { source, status, operation, page, limit } = queries;

    const offset = calculateOffset({ page, limit });
    const wallet = await this.walletRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        id: walletId,
      },
    });
    if (!wallet) throw new BadRequestException(_404.WALLET_DOES_NOT_EXIST);

    const queryBuilder = await this.walletTransactionRepository
      .createQueryBuilder('transactions')
      .innerJoin('transactions.wallet', 'wallet')
      .where('wallet.id = :walletId', { walletId: wallet.id })
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

    queryBuilder.take(limit).skip(offset);
    const [transactions, total] = await queryBuilder.getManyAndCount();
    return dataResponse({
      data: transactions,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
      },
    });
  }
}

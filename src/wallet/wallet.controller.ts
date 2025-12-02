import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../db/entities/user.entity';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { WalletTopUpDTo, WalletWithdrawDTO } from './dto/wallet-withdraw.dto';
import { TransferMoneyDTO } from './dto/transfer-money.dto';
import { TransactionQueriesDto } from './dto/transaction-queries.dto';
import { AuditTrailDecorator } from '../common/decorators/audit-trail.decorator';
import { AuditTrailEvents } from '../common/constants/types.enum';

@Controller()
@ApiSecurity('access-token')
@ApiTags('Wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('wallets')
  @ApiOperation({
    summary: "Fetch all the user's wallet",
  })
  @AuditTrailDecorator(AuditTrailEvents.USER_FETCH_TRANSACTIONS)
  async getUserWallets(@CurrentUser() user: User) {
    return this.walletService.getUserWallet(user);
  }

  @Post('wallets')
  @ApiOperation({
    summary: 'Create a new user wallet.',
  })
  async create(@CurrentUser() user: User, @Body() dto: CreateWalletDTO) {
    return this.walletService.create(user, dto);
  }

  @Post('user/wallets/:id/withdraw')
  @ApiOperation({
    summary: 'Allows a user to withdraw into a pocket',
  })
  @AuditTrailDecorator(AuditTrailEvents.USER_WITHDRAW)
  async walletWithdraw(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser() user: User,
    @Body() dto: WalletWithdrawDTO,
  ) {
    return this.walletService.withdraw(id, user, dto);
  }

  @Post('user/wallets/:id/deposit')
  @ApiOperation({ summary: 'Allows a user to deposit into a pocket' })
  @AuditTrailDecorator(AuditTrailEvents.USER_TOP_UP)
  async walletTopUp(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser() user: User,
    @Body() dto: WalletTopUpDTo,
  ) {
    return this.walletService.topUp(id, user, dto);
  }

  @Post('user/wallets/:id/transfer')
  @ApiOperation({
    summary: 'Allows a user to transfer funds using a username as key',
  })
  @AuditTrailDecorator(AuditTrailEvents.USER_TRANSFER)
  async transfer(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser() user: User,
    @Body() dto: TransferMoneyDTO,
  ) {
    return this.walletService.transferBetweenWallets(id, user, dto);
  }

  @Get('user/wallets/:id/transactions')
  @ApiOperation({
    summary: 'Allows a user to query transactions',
  })
  @AuditTrailDecorator(AuditTrailEvents.USER_WITHDRAW)
  async loadAlltransactions(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser() user: User,
    @Query() queries: TransactionQueriesDto,
  ) {
    return this.walletService.loadAllWalletTransactions(id, user, queries);
  }
}

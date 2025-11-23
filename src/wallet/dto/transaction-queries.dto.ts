import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import {
  WalletTransactionOperation,
  WalletTransactionSource,
  WalletTransactionStatus,
} from '../../common/constants/types.enum';

export class TransactionQueriesDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsEnum(WalletTransactionOperation)
  operation: WalletTransactionOperation;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(WalletTransactionSource)
  source: WalletTransactionSource;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(WalletTransactionStatus)
  status: WalletTransactionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  //   @IsNumber()
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  //   @IsNumber()
  limit: number;
}

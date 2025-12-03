import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import {
  WalletTransactionOperation,
  WalletTransactionSource,
  WalletTransactionStatus,
} from '../../common/constants/types.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class TransactionQueriesDto extends PickType(PaginationDto, [
  'page',
  'limit',
]) {
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

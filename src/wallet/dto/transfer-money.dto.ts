import { ApiProperty, PickType } from '@nestjs/swagger';
import { WalletWithdrawDTO } from './wallet-withdraw.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransferMoneyDTO extends PickType(WalletWithdrawDTO, [
  'amount',
  'idempotencyKey',
]) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Username of the user who the money is to be transferred to',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'KES',
  })
  currency: string;
}

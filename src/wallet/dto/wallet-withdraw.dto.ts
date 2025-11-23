import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WalletWithdrawDTO {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @ApiProperty({
    example: 300,
  })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '44f88c1d-3b34-4b04-afd0-1ef308e91552',
  })
  idempotencyKey: string;
}

export class WalletTopUpDTo extends PickType(WalletWithdrawDTO, [
  'amount',
  'idempotencyKey',
]) {}

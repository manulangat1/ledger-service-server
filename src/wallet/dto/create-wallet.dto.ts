import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CurrencySymbol } from '../../common/constants/types.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDTO {
  @ApiProperty({
    example: 'KES',
  })
  @IsNotEmpty()
  @IsEnum(CurrencySymbol)
  currency: CurrencySymbol;
}

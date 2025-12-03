import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IdentificationType } from '../../common/constants/types.enum';

export class KycDto {
  @ApiProperty({
    example: IdentificationType.NATIONAL_ID,
  })
  @IsEnum(IdentificationType)
  @IsNotEmpty()
  identificationType: string;

  @ApiProperty({
    example: 'KE',
  })
  @IsString()
  @IsNotEmpty()
  identificationCountry: string;

  @ApiProperty({
    example: '001122',
  })
  @IsString()
  @IsNotEmpty()
  identificationNumber: string;

  @ApiProperty({
    example: 'KE',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: 'Nairobi',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'Kco',
  })
  @IsString()
  @IsNotEmpty()
  postalAddress: string;

  @ApiProperty({
    example: '20200',
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    example: 'KE',
  })
  @IsString()
  @IsNotEmpty()
  residentialAddress: string;

  @ApiProperty({
    example: 'KE',
  })
  @IsString()
  @IsNotEmpty()
  proofOfAddress: string;

  @ApiProperty({
    example: 'KE',
  })
  @IsString()
  @IsNotEmpty()
  nextOfKinNames: string;

  @ApiProperty({
    example: 'KE',
  })
  @IsString()
  @IsNotEmpty()
  nextOfKinEmail: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @ApiProperty({
    example: 10,
  })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  limit: number;
}

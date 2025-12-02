import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../db/entities/user.entity';
import { Admin } from '../../db/entities/admin.entity';

export class CreateAuditTrailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Fetching all users',
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Fetching all users',
  })
  event: string;

  @IsOptional()
  @ApiPropertyOptional()
  user?: User;

  @IsOptional()
  @ApiPropertyOptional()
  admin?: Admin;
}

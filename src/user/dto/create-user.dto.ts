import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    default: 'John ',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    default: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

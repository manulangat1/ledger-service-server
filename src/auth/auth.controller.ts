import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() dto: CreateUserDto) {
    return this.authService.create(dto);
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: any) {}
}

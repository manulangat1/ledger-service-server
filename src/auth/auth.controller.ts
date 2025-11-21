import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from '../user/dto/login-user.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
@ApiTags('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() dto: CreateUserDto) {
    return this.authService.create(dto);
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }
}

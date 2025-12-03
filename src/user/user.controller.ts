import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../db/entities/user.entity';
import { ApiSecurity } from '@nestjs/swagger';
import { KycDto } from './dto/kyc.dto';

@Controller('user')
@ApiSecurity('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  loadProfile(@CurrentUser() user: User) {
    return this.userService.loadUserProfile(user);
  }

  @Patch('kyc')
  uploadKyc(@CurrentUser() user: User, @Body() dto: KycDto) {
    return this.userService.uploadKyc(user, dto);
  }
}

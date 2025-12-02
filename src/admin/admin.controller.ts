import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Admin } from '../db/entities/admin.entity';
import { TransactionQueriesDto } from '../wallet/dto/transaction-queries.dto';
import { CreateUserByAdminDto } from '../user/dto/create-user.dto';
import { UserType } from '../common/decorators/user-type.decorator';
import {
  AdminPermissions,
  UserTypesEnum,
} from '../common/constants/types.enum';
import { UserPermission } from '../common/decorators/user-permissions.decorator';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('transactions')
  @UserPermission(AdminPermissions.SUPER_ADMIN)
  @UserType(UserTypesEnum.ADMIN)
  async loadTransactions(
    @CurrentUser() admin: Admin,
    @Query() queries: TransactionQueriesDto,
  ) {
    return this.adminService.fetchAllTransaction(admin, queries);
  }

  @Get('analytics')
  @UserPermission(AdminPermissions.SUPER_ADMIN)
  @UserType(UserTypesEnum.ADMIN)
  async getAnalytics(@CurrentUser() admin: Admin) {
    return this.adminService.loadStatistics();
  }

  @Post('user')
  @UserPermission(AdminPermissions.SUPER_ADMIN)
  @UserType(UserTypesEnum.ADMIN)
  async addUser(
    @CurrentUser() admin: Admin,
    @Body() dto: CreateUserByAdminDto,
  ) {
    return this.adminService.addUser(dto, admin);
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TYPES } from '../decorators/user-type.decorator';
import { _403 } from '../constants/error_messages';
import { ADMIN_PERMISSIONS } from '../constants/general.constants';
import { AdminPermissions, UserTypesEnum } from '../constants/types.enum';
import { AuthorizedUserDto } from '../dto/authorized-user.dto';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: any = context.switchToHttp().getRequest();

    const user = request.user as AuthorizedUserDto;

    const type = this.reflector.get<string[]>(TYPES, context.getHandler());
    if (!type) return true;

    if (!type.includes(user.type))
      throw new ForbiddenException(_403.ACCESS_DENIED);

    const adminAllowedPermissions = this.reflector.get<string[]>(
      ADMIN_PERMISSIONS,
      context.getHandler(),
    );

    if (user.type === UserTypesEnum.ADMIN && adminAllowedPermissions?.length) {
      if (user.permissions) {
        const isAllowed = user?.permissions.some(
          (permission: AdminPermissions) =>
            adminAllowedPermissions.includes(permission),
        );

        if (!isAllowed) throw new ForbiddenException(_403.ACCESS_DENIED);
      } else {
        throw new ForbiddenException(_403.ACCESS_DENIED);
      }
    }

    return true;
  }
}

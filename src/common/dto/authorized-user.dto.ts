import { Admin } from '../../db/entities/admin.entity';
import { User } from '../../db/entities/user.entity';
import { AdminPermissions, UserTypesEnum } from '../constants/types.enum';

export class AuthorizedUserDto {
  user: User | Admin;
  type: string;
  permissions?: AdminPermissions[];
}
export const authorizedUser = (
  user: User | Admin,
  type: string,
  permissions?: AdminPermissions[],
): AuthorizedUserDto => ({ user, type, permissions });

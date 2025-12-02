import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ADMIN_PERMISSIONS } from '../constants/general.constants';

export const UserPermission = (...args: string[]): CustomDecorator<string> =>
  SetMetadata(ADMIN_PERMISSIONS, args);

import { CustomDecorator, SetMetadata } from '@nestjs/common';
export const TYPES = 'TYPES';
export const UserType = (...types: string[]): CustomDecorator =>
  SetMetadata(TYPES, types);

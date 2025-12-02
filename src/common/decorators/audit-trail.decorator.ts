import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { AUDIT_TRAIL_DESCRIPTION } from '../constants/general.constants';

export const AuditTrailDecorator = (description): CustomDecorator =>
  SetMetadata(AUDIT_TRAIL_DESCRIPTION, description);

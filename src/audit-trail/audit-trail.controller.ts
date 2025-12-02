import { Controller } from '@nestjs/common';
import { AuditTrailService } from './audit-trail.service';

@Controller('audit-trail')
export class AuditTrailController {
  constructor(private readonly auditTrailService: AuditTrailService) {}
}

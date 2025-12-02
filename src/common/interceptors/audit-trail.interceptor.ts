import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { AUDIT_TRAIL_DESCRIPTION } from '../constants/general.constants';
import { UserTypesEnum } from '../constants/types.enum';
import { AuditTrailService } from '../../audit-trail/audit-trail.service';

@Injectable()
export class AuditTrailInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditTrailService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const description = this.reflector.getAllAndOverride(
      AUDIT_TRAIL_DESCRIPTION,
      [context.getHandler(), context.getClass()],
    );

    const authPayload = request.user; // may be undefined

    return next.handle().pipe(
      tap(async () => {
        if (!authPayload) {
          return;
        }

        const { user, type } = authPayload;
        const desc = description ?? 'Desc not specified';

        if (!user) return;

        if (type === UserTypesEnum.USER) {
          await this.auditService.create({
            user,
            event: desc,
            description: desc,
          });
        }

        if (type === UserTypesEnum.ADMIN) {
          await this.auditService.create({
            admin: user,
            event: desc,
            description: desc,
          });
        }
      }),
    );
  }
}

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
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { user, type } = request.user;

    const description = this.reflector.getAllAndOverride(
      AUDIT_TRAIL_DESCRIPTION,
      [context.getHandler(), context.getClass()],
    );

    console.log(description, 'my desc');
    return next.handle().pipe(
      tap(async () => {
        if (user) {
          switch (type) {
            case UserTypesEnum.USER:
              await this.auditService.create({
                user,
                event: description ? description : 'Desc not specified',
                description: description ? description : 'Desc not specified',
              });
              break;
            case UserTypesEnum.ADMIN:
              await this.auditService.create({
                admin: user,
                event: description ? description : 'Desc not specified',
                description: description ? description : 'Desc not specified',
              });
              break;
            default:
              return;
          }
        }
      }),
    );
  }
}

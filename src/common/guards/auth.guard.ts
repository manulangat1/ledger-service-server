import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserService } from '../../user/user.service';
import { UserTypesEnum } from '../constants/types.enum';
import { AdminService } from '../../admin/admin.service';
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('Auth Guard');
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      const { email, type } = payload;

      if (type === UserTypesEnum.USER) {
        const user = await this.userService.findByEmail(payload.email);
        request['user'] = { user, type };
        return true;
      } else {
        const user = await this.adminService.findByEmail(email);
        request['user'] = { user, type, permissions: user?.permissions };
        return true;
      }
    } catch (error) {
      this.logger.error(`Failed with error message ${error}`);

      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

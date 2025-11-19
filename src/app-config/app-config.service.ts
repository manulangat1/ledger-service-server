import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesDTO } from './dto/env-variables.dto';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<EnvironmentVariablesDTO>) {}

  get port(): number {
    return this.configService.getOrThrow('port');
  }

  get environment(): string {
    return this.configService.getOrThrow('environment');
  }

  get clientHostName(): string {
    return this.configService.getOrThrow('CLIENT_HOST_NAME');
  }

  get adminHostName(): string {
    return this.configService.getOrThrow('ADMIN_HOST_NAME');
  }
}

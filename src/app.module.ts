import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { AppConfigModule } from './app-config/app-config.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { AntiSpecialCharsMiddleware } from './common/middleware/anti-special-characters.middleware';
import { TrimmerMiddleware } from './common/middleware/trimmer.middleware';
import { LoggerMiddleware } from './common/middleware/logs.middleware';

@Module({
  imports: [HealthcheckModule, AppConfigModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AntiSpecialCharsMiddleware).forRoutes('*');
    consumer.apply(TrimmerMiddleware, LoggerMiddleware).forRoutes('*');
  }
}

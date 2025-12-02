import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { AppConfigModule } from './app-config/app-config.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { AntiSpecialCharsMiddleware } from './common/middleware/anti-special-characters.middleware';
import { TrimmerMiddleware } from './common/middleware/trimmer.middleware';
import { LoggerMiddleware } from './common/middleware/logs.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './common/guards/auth.guard';
import { WalletModule } from './wallet/wallet.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';
import { UserTypeGuard } from './common/guards/user-type.guard';

@Module({
  imports: [
    HealthcheckModule,
    AppConfigModule,
    AuthModule,
    UserModule,
    WalletModule,
    DashboardModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserTypeGuard,
    },
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

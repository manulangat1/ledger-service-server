import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeorm from '../config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const options = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!options) {
          throw new Error('TypeORM configuration not found in configService');
        }
        return options;
      },
    }),
  ],
  providers: [AppConfigService],
})
export class AppConfigModule {}

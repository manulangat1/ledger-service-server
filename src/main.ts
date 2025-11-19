import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import { isIn } from 'class-validator';
import { _401 } from './common/constants/error_messages';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_DOCUMENTATION_PATH } from './common/constants/general.constants';
import { AppConfigService } from './app-config/app-config.service';
import { EnvironmentEnum } from './common/constants/types.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  get the required environment variables.

  const { port, clientHostName, adminHostName, environment } =
    app.get(AppConfigService);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const isProductionEnvironment = environment === EnvironmentEnum.PRODUCTION;

  if (!isProductionEnvironment) enableApiDocumentation(app);

  app.use(helmet());

  const allowedClientApplicationsOrigin: string[] = [
    clientHostName,
    adminHostName,
  ];

  app.enableCors({
    origin: (origin, callback): void => {
      if (!origin || isIn(origin, allowedClientApplicationsOrigin)) {
        callback(null, origin);
      } else {
        callback(new UnauthorizedException(_401.ORIGIN_NOT_SUPPORTED));
      }
    },
  });

  await app.listen(port ?? 3000);
}
bootstrap();

/**
 * Set up SWAGGER DOCUMENTATION for all available routes.
 *
 * @param app app instance
 */

const enableApiDocumentation = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Ledger Service')
    .setDescription('Ledger Service')
    .setVersion('1.0')
    .addTag('Ledger Service')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_DOCUMENTATION_PATH, app, documentFactory);
};

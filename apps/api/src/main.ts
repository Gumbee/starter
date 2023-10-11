import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NODE_ENV } from './constants/environment';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import Handlebars from 'hbs';
import { join } from 'path';
import { GeneralExceptionFilter } from './filters/generalException.filter';

const config = new DocumentBuilder().setTitle(`Logbook API`).setDescription(`Documentation for the Logbook API`).setVersion(`1.0`).build();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: `1`,
  });

  app.enableCors({
    origin: ['production', 'test'].includes(NODE_ENV)
      ? [process.env.FRONTEND_URL ?? `http://localhost:3000`, 'tauri://localhost']
      : ['http://localhost:3000', 'http://localhost:3000', 'tauri://localhost'],
    credentials: true,
  });

  Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // only allows input from specified DTO fields
    }),
  );
  app.useGlobalFilters(new GeneralExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', '..', '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', '..', 'views'));
  app.setViewEngine('hbs');

  app.use(cookieParser());

  // enable swagger in development
  if (NODE_ENV === 'development') {
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(`docs`, app, document);
  }

  await app.listen(process.env.PORT ?? 3001);

  Logger.log(`API is running on: ${await app.getUrl()}`);
}
bootstrap();

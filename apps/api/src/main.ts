import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NODE_ENV } from './constants/environment';

const config = new DocumentBuilder().setTitle(`Logbook API`).setDescription(`Documentation for the Logbook API`).setVersion(`1.0`).build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: `1`,
  });

  app.enableCors({
    origin: ['production', 'test'].includes(NODE_ENV)
      ? [process.env.FRONTEND_URL ?? `http://localhost:3000`]
      : ['http://localhost:3000', 'http://localhost:3000'],
    credentials: true,
  });

  // enable swagger in development
  if (NODE_ENV === 'development') {
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(`docs`, app, document);
  }

  await app.listen(3001);
}
bootstrap();

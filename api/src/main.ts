import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { GlobalHttpExceptionFilter } from './common/filters/global-http-exception.filter';
import { patchOpenApiDocument } from './common/swagger/openapi-document.patch';
import {
  swaggerConfig,
  swaggerOperationId,
} from './common/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const frontendUrl = process.env.FRONTEND_URL;

  app.enableCors({
    origin: (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return cb(null, true);
      if (frontendUrl && origin === frontendUrl) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    operationIdFactory: swaggerOperationId,
  });
  patchOpenApiDocument(document);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

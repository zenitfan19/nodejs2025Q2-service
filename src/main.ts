import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggingService } from './logging/logging.service';

dotenvConfig();

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  app.useGlobalFilters(new GlobalExceptionFilter(loggingService));

  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));

  process.on('uncaughtException', (error: Error) => {
    loggingService.error(
      `Uncaught Exception: ${error.message}`,
      'UncaughtException',
      {
        stack: error.stack,
        name: error.name,
      },
    );
    // Don't exit immediately, allow time for logging
    setTimeout(() => process.exit(1), 1000);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    loggingService.error(
      `Unhandled Rejection: ${reason}`,
      'UnhandledRejection',
      {
        reason: String(reason),
        promise: String(promise),
      },
    );
  });

  loggingService.info('Application starting up', 'Application');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  // Try to load the custom OpenAPI spec if it exists
  const apiDocPath = path.join(__dirname, '..', 'doc', 'api.yaml');
  let document;

  try {
    if (fs.existsSync(apiDocPath)) {
      const yamlContent = fs.readFileSync(apiDocPath, 'utf8');
      document = yaml.load(yamlContent) as any;
      loggingService.info(
        'Loaded custom OpenAPI specification from api-updated.yaml',
        'Application',
      );
    } else {
      // Fallback to auto-generated documentation
      document = SwaggerModule.createDocument(app, config);
      loggingService.info(
        'Using auto-generated OpenAPI specification',
        'Application',
      );
    }
  } catch (error) {
    loggingService.warn(
      `Failed to load custom API spec, using auto-generated: ${error.message}`,
      'Application',
    );
    document = SwaggerModule.createDocument(app, config);
  }

  SwaggerModule.setup('doc', app, document, {
    customSiteTitle: 'Home Library API Documentation',
  });

  await app.listen(port);
  loggingService.info(
    `Application is running on: http://localhost:${port}`,
    'Application',
  );
  loggingService.info(
    `API Documentation available at: http://localhost:${port}/doc`,
    'Application',
  );
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer', // This name here is important for matching @ApiBearerAuth() decorators
    )
    .build();

  // Generate OpenAPI documentation
  const document = SwaggerModule.createDocument(app, config);

  // Ensure global security requirement exists to make "Authorize" button appear
  if (!document.security) {
    document.security = [];
  }
  document.security.push({ bearer: [] });

  // Debug: log the security configuration
  loggingService.info(
    `OpenAPI security configuration: ${JSON.stringify({
      securitySchemes: document.components?.securitySchemes || 'none',
      globalSecurity: document.security || 'none',
    })}`,
    'Application',
  );

  loggingService.info(
    'Using programmatically generated OpenAPI specification with JWT auth',
    'Application',
  );

  SwaggerModule.setup('doc', app, document, {
    customSiteTitle: 'Home Library API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
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

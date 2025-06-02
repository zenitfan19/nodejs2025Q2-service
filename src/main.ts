import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

dotenvConfig();

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);

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
      console.log('Loaded custom OpenAPI specification from api-updated.yaml');
    } else {
      // Fallback to auto-generated documentation
      document = SwaggerModule.createDocument(app, config);
      console.log('Using auto-generated OpenAPI specification');
    }
  } catch (error) {
    console.warn(
      'Failed to load custom API spec, using auto-generated:',
      error.message,
    );
    document = SwaggerModule.createDocument(app, config);
  }

  SwaggerModule.setup('doc', app, document, {
    customSiteTitle: 'Home Library API Documentation',
  });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation available at: http://localhost:${port}/doc`);
}

bootstrap();

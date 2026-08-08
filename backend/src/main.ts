import 'dotenv/config';
import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './http-error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const rootDir = join(process.cwd(), '..');

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-webhook-secret']
  });
  app.use(json({ limit: '25mb' }));
  app.use(urlencoded({ limit: '25mb', extended: true }));
  app.useGlobalFilters(new HttpErrorFilter());
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }]
  });
  app.useStaticAssets(rootDir, { index: false });

  const port = Number(process.env.PORT || 4000);
  const host = process.env.HOST || '127.0.0.1';
  await app.listen(port, host);

  console.log(`MyTeacher CRM NestJS backend: http://${host}:${port}`);
  console.log('Demo admin: admin@myteacher.uz / admin12345');
  console.log('Demo manager: diyora@myteacher.uz / manager12345');
}

bootstrap();

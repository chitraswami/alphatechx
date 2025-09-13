import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req: any, res: any) => {
    res.status(200).json({ status: 'ok', service: 'bot-service' });
  });

  // Test endpoint for bot functionality (no auth required)
  app.getHttpAdapter().get('/test', (req: any, res: any) => {
    res.status(200).json({ 
      message: 'Bot service is working!',
      endpoints: [
        'POST /api/projects/get-or-create - Create/get user project',
        'POST /api/billing/start-trial - Start 14-day trial',
        'POST /api/projects/:id/documents/upload - Upload documents',
        'POST /api/projects/:id/train - Train the bot',
        'GET /api/projects/:id/integrations/install-urls - Get integration URLs'
      ],
      note: 'All API endpoints require JWT authentication'
    });
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`bot-service listening on http://0.0.0.0:${port}`);
}

bootstrap(); 
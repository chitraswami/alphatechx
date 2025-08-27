import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { DocumentAsset } from '../entities/document-asset.entity';
import { TrainingJob } from '../entities/training-job.entity';
import { Subscription } from '../entities/subscription.entity';
import { IntegrationInstallation } from '../entities/integration-installation.entity';

export const typeOrmConfig = async (): Promise<TypeOrmModuleOptions> => {
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const username = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || 'postgres';
  const database = process.env.POSTGRES_DB || 'bot_service';

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [Project, DocumentAsset, TrainingJob, Subscription, IntegrationInstallation],
    synchronize: true, // set false in production with migrations
    logging: false,
  } as TypeOrmModuleOptions;
}; 
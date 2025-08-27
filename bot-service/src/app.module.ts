import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm';
import { Project } from './entities/project.entity';
import { DocumentAsset } from './entities/document-asset.entity';
import { TrainingJob } from './entities/training-job.entity';
import { Subscription } from './entities/subscription.entity';
import { IntegrationInstallation } from './entities/integration-installation.entity';
import { ProjectsModule } from './projects/projects.module';
import { BillingModule } from './billing/billing.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: typeOrmConfig }),
    TypeOrmModule.forFeature([
      Project,
      DocumentAsset,
      TrainingJob,
      Subscription,
      IntegrationInstallation,
    ]),
    ProjectsModule,
    BillingModule,
    IntegrationsModule,
    TrainingModule,
  ],
})
export class AppModule {} 
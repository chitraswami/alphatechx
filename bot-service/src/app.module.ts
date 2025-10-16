import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { typeOrmConfig } from './config/typeorm';
import { Project } from './entities/project.entity';
import { DocumentAsset } from './entities/document-asset.entity';
import { TrainingJob } from './entities/training-job.entity';
import { Subscription } from './entities/subscription.entity';
import { IntegrationInstallation } from './entities/integration-installation.entity';
import { MainUser } from './entities/main-user.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { BillingModule } from './billing/billing.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { TrainingModule } from './training/training.module';
import { FileProcessorService } from './services/file-processor.service';
import { UploadsController } from './uploads/uploads.controller';

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
      MainUser,
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    // Temporarily disabled complex modules to get basic functionality working
    // AuthModule,
    // ProjectsModule,
    // BillingModule,
    // IntegrationsModule,
    // TrainingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 
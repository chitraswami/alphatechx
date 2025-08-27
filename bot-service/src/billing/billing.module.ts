import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../entities/subscription.entity';
import { Project } from '../entities/project.entity';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Project])],
  providers: [BillingService],
  controllers: [BillingController],
})
export class BillingModule {} 
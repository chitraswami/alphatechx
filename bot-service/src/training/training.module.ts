import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingJob } from '../entities/training-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingJob])],
})
export class TrainingModule {} 
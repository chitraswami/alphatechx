import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

export type TrainingStatus = 'queued' | 'running' | 'succeeded' | 'failed';

@Entity({ name: 'training_jobs' })
export class TrainingJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, (p) => p.trainingJobs, { onDelete: 'CASCADE' })
  project!: Project;

  @Column({ default: 'queued' })
  status!: TrainingStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null = null;

  @CreateDateColumn()
  startedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt: Date | null = null;
} 
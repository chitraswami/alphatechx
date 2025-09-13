import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DocumentAsset } from './document-asset.entity';
import { TrainingJob } from './training-job.entity';
import { Subscription } from './subscription.entity';
import { IntegrationInstallation } from './integration-installation.entity';

export type PlanType = 'free' | 'pro' | 'enterprise';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'My Bot' })
  name!: string;

  @Column()
  ownerUserId!: string;

  @Column({ default: 'free' })
  plan!: PlanType;

  @Column({ type: 'timestamptz', nullable: true })
  trialEndsAt: Date | null = null;

  @OneToMany(() => DocumentAsset, (d) => d.project)
  documents!: DocumentAsset[];

  @OneToMany(() => TrainingJob, (t) => t.project)
  trainingJobs!: TrainingJob[];

  @OneToMany(() => Subscription, (s) => s.project)
  subscriptions!: Subscription[];

  @OneToMany(() => IntegrationInstallation, (i) => i.project)
  installations!: IntegrationInstallation[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
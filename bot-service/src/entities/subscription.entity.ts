import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project, PlanType } from './project.entity';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, (p) => p.subscriptions, { onDelete: 'CASCADE' })
  project!: Project;

  @Column({ type: 'text', nullable: true })
  stripeCustomerId: string | null = null;

  @Column({ type: 'text', nullable: true })
  stripeSubscriptionId: string | null = null;

  @Column({ default: 'free' })
  plan!: PlanType;

  @Column({ default: 'trialing' })
  status!: SubscriptionStatus;

  @Column({ type: 'timestamptz', nullable: true })
  trialEndsAt: Date | null = null;

  @Column({ type: 'timestamptz', nullable: true })
  currentPeriodEnd: Date | null = null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 
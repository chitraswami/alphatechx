import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity({ name: 'integration_installations' })
export class IntegrationInstallation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, (p) => p.installations, { onDelete: 'CASCADE' })
  project!: Project;

  @Column({ type: 'text', nullable: true })
  slackTeamId: string | null = null;

  @Column({ type: 'text', nullable: true })
  slackBotToken: string | null = null;

  @Column({ type: 'text', nullable: true })
  msTeamsTenantId: string | null = null;

  @Column({ type: 'text', nullable: true })
  msTeamsBotId: string | null = null;

  @CreateDateColumn()
  createdAt!: Date;
} 
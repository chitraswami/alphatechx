import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity({ name: 'integration_installations' })
export class IntegrationInstallation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, (p) => p.installations, { onDelete: 'CASCADE' })
  project!: Project;

  @Column({ type: 'varchar', length: 64, nullable: true })
  slackTeamId: string | null = null;

  @Column({ type: 'varchar', length: 256, nullable: true })
  slackBotToken: string | null = null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  msTeamsTenantId: string | null = null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  msTeamsBotId: string | null = null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
} 
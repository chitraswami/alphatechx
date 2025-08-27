import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity({ name: 'document_assets' })
export class DocumentAsset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, (p) => p.documents, { onDelete: 'CASCADE' })
  project!: Project;

  @Column({ type: 'varchar', length: 256 })
  fileName!: string;

  @Column({ type: 'varchar', length: 128 })
  mimeType!: string;

  @Column({ type: 'bigint' })
  sizeBytes!: string;

  @Column({ type: 'text', nullable: true })
  storageUrl: string | null = null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
} 
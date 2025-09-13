import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity({ name: 'document_assets' })
export class DocumentAsset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, (p) => p.documents, { onDelete: 'CASCADE' })
  project!: Project;

  @Column()
  fileName!: string;

  @Column()
  mimeType!: string;

  @Column()
  sizeBytes!: string;

  @Column({ type: 'text', nullable: true })
  storageUrl: string | null = null;

  @CreateDateColumn()
  createdAt!: Date;
} 
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { DocumentAsset } from '../entities/document-asset.entity';
import { TrainingJob } from '../entities/training-job.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(DocumentAsset) private readonly docRepo: Repository<DocumentAsset>,
    @InjectRepository(TrainingJob) private readonly jobRepo: Repository<TrainingJob>,
  ) {}

  async getOrCreateDefaultProject(ownerUserId: string): Promise<Project> {
    let project = await this.projectRepo.findOne({ where: { ownerUserId } });
    if (!project) {
      project = this.projectRepo.create({ ownerUserId, name: 'My Bot', plan: 'free' });
      await this.projectRepo.save(project);
    }
    return project;
  }

  async getOwnedProjectById(ownerUserId: string, id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerUserId !== ownerUserId) throw new ForbiddenException('Not your project');
    return project;
  }

  async saveUploadedDocuments(projectId: string, files: Express.Multer.File[]) {
    const assets = files.map((f) =>
      this.docRepo.create({
        project: { id: projectId } as Project,
        fileName: f.originalname,
        mimeType: f.mimetype,
        sizeBytes: String(f.size),
        storageUrl: null, // TODO: upload to S3 and store URL
      }),
    );
    await this.docRepo.save(assets);
  }

  async queueTrainingJob(projectId: string): Promise<TrainingJob> {
    const job = this.jobRepo.create({ project: { id: projectId } as Project, status: 'queued' });
    return this.jobRepo.save(job);
  }
} 
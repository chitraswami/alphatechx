import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { DocumentAsset } from '../entities/document-asset.entity';
import { TrainingJob } from '../entities/training-job.entity';
export declare class ProjectsService {
    private readonly projectRepo;
    private readonly docRepo;
    private readonly jobRepo;
    constructor(projectRepo: Repository<Project>, docRepo: Repository<DocumentAsset>, jobRepo: Repository<TrainingJob>);
    getOrCreateDefaultProject(ownerUserId: string): Promise<Project>;
    getOwnedProjectById(ownerUserId: string, id: string): Promise<Project>;
    saveUploadedDocuments(projectId: string, files: any[]): Promise<void>;
    queueTrainingJob(projectId: string): Promise<TrainingJob>;
}

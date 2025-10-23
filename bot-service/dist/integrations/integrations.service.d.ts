import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
export declare class IntegrationsService {
    private readonly projectRepo;
    constructor(projectRepo: Repository<Project>);
    getInstallUrls(ownerUserId: string, projectId: string): Promise<{
        slack: string | undefined;
        teams: string | undefined;
    }>;
}

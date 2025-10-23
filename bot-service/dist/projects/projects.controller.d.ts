import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getOrCreate(user: any): Promise<{
        project: import("../entities/project.entity").Project;
    }>;
    getProject(id: string, user: any): Promise<{
        project: import("../entities/project.entity").Project;
    }>;
    uploadDocuments(id: string, files: any[], user: any): Promise<{
        success: boolean;
    }>;
    train(id: string, user: any): Promise<{
        success: boolean;
        jobId: string;
    }>;
}

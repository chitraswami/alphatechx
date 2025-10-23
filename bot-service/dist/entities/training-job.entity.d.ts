import { Project } from './project.entity';
export type TrainingStatus = 'queued' | 'running' | 'succeeded' | 'failed';
export declare class TrainingJob {
    id: string;
    project: Project;
    status: TrainingStatus;
    errorMessage: string | null;
    startedAt: Date;
    updatedAt: Date;
    finishedAt: Date | null;
}

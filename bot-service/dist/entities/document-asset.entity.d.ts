import { Project } from './project.entity';
export declare class DocumentAsset {
    id: string;
    project: Project;
    fileName: string;
    mimeType: string;
    sizeBytes: string;
    storageUrl: string | null;
    createdAt: Date;
}

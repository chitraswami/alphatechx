import { FileProcessorService } from '../services/file-processor.service';
interface FileResult {
    filename: string;
    originalName: string;
    size: number;
    status: 'processing' | 'completed' | 'failed';
    documentId?: string;
    error?: string;
}
interface UploadResponse {
    success: boolean;
    message: string;
    files: FileResult[];
}
export declare class UploadsController {
    private fileProcessor;
    private readonly logger;
    private readonly uploadPath;
    constructor(fileProcessor: FileProcessorService);
    uploadFiles(files: Express.Multer.File[]): Promise<UploadResponse>;
    getDocumentStatus(documentId: string): Promise<any>;
    testQuery(body: {
        query: string;
    }): Promise<any>;
}
export {};

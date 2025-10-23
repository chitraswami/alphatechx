export interface ProcessedDocument {
    id: string;
    filename: string;
    type: 'text' | 'image' | 'table';
    content: string;
    chunks: DocumentChunk[];
    metadata: {
        pageCount?: number;
        wordCount?: number;
        imageAnalysis?: string;
    };
}
export interface DocumentChunk {
    id: string;
    content: string;
    embedding: number[];
    metadata: {
        source: string;
        page?: number;
        chunkIndex: number;
    };
}
export declare class FileProcessorService {
    private readonly logger;
    private openai;
    private pinecone;
    constructor();
    processFile(filePath: string, filename: string): Promise<ProcessedDocument>;
    private processPDF;
    private processDOCX;
    private processExcel;
    private processImage;
    private processText;
    private chunkText;
    private generateEmbeddings;
    private storeInPinecone;
    searchSimilarContent(query: string, topK?: number): Promise<any[]>;
    private generateId;
}

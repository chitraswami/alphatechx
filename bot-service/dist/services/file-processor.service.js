"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessorService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const pinecone_1 = require("@pinecone-database/pinecone");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdfParse = __importStar(require("pdf-parse"));
const mammoth = __importStar(require("mammoth"));
const XLSX = __importStar(require("xlsx"));
const sharp = __importStar(require("sharp"));
let FileProcessorService = FileProcessorService_1 = class FileProcessorService {
    constructor() {
        this.logger = new common_1.Logger(FileProcessorService_1.name);
        this.openai = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.pinecone = new pinecone_1.Pinecone({
            apiKey: process.env.PINECONE_API_KEY || '',
            environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1-aws',
        });
    }
    async processFile(filePath, filename) {
        this.logger.log(`Processing file: ${filename}`);
        const fileExtension = path.extname(filename).toLowerCase();
        let processedDoc;
        try {
            switch (fileExtension) {
                case '.pdf':
                    processedDoc = await this.processPDF(filePath, filename);
                    break;
                case '.docx':
                    processedDoc = await this.processDOCX(filePath, filename);
                    break;
                case '.xlsx':
                case '.xls':
                    processedDoc = await this.processExcel(filePath, filename);
                    break;
                case '.jpg':
                case '.jpeg':
                case '.png':
                case '.gif':
                    processedDoc = await this.processImage(filePath, filename);
                    break;
                case '.txt':
                    processedDoc = await this.processText(filePath, filename);
                    break;
                default:
                    throw new Error(`Unsupported file type: ${fileExtension}`);
            }
            await this.generateEmbeddings(processedDoc);
            await this.storeInPinecone(processedDoc);
            this.logger.log(`Successfully processed ${filename} with ${processedDoc.chunks.length} chunks`);
            return processedDoc;
        }
        catch (error) {
            this.logger.error(`Error processing file ${filename}:`, error);
            throw error;
        }
    }
    async processPDF(filePath, filename) {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse.default(dataBuffer);
        const chunks = this.chunkText(pdfData.text, filename);
        return {
            id: this.generateId(),
            filename,
            type: 'text',
            content: pdfData.text,
            chunks,
            metadata: {
                pageCount: pdfData.numpages,
                wordCount: pdfData.text.split(' ').length,
            },
        };
    }
    async processDOCX(filePath, filename) {
        const result = await mammoth.extractRawText({ path: filePath });
        const text = result.value;
        const chunks = this.chunkText(text, filename);
        return {
            id: this.generateId(),
            filename,
            type: 'text',
            content: text,
            chunks,
            metadata: {
                wordCount: text.split(' ').length,
            },
        };
    }
    async processExcel(filePath, filename) {
        const workbook = XLSX.readFile(filePath);
        let allText = '';
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const csvData = XLSX.utils.sheet_to_csv(worksheet);
            allText += `Sheet: ${sheetName}\n${csvData}\n\n`;
        });
        const chunks = this.chunkText(allText, filename);
        return {
            id: this.generateId(),
            filename,
            type: 'table',
            content: allText,
            chunks,
            metadata: {
                wordCount: allText.split(' ').length,
            },
        };
    }
    async processImage(filePath, filename) {
        const optimizedBuffer = await sharp.default(filePath)
            .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
        const base64Image = optimizedBuffer.toString('base64');
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4-vision-preview',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Analyze this image and provide a detailed description of its contents, including any text, objects, people, or important details that would be useful for answering questions about this image.',
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 500,
        });
        const imageAnalysis = response.choices[0]?.message?.content || 'Unable to analyze image';
        const chunks = this.chunkText(imageAnalysis, filename);
        return {
            id: this.generateId(),
            filename,
            type: 'image',
            content: imageAnalysis,
            chunks,
            metadata: {
                imageAnalysis,
            },
        };
    }
    async processText(filePath, filename) {
        const text = fs.readFileSync(filePath, 'utf-8');
        const chunks = this.chunkText(text, filename);
        return {
            id: this.generateId(),
            filename,
            type: 'text',
            content: text,
            chunks,
            metadata: {
                wordCount: text.split(' ').length,
            },
        };
    }
    chunkText(text, filename) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const chunks = [];
        const chunkSize = 3;
        for (let i = 0; i < sentences.length; i += chunkSize) {
            const chunkText = sentences.slice(i, i + chunkSize).join('. ').trim();
            if (chunkText.length > 0) {
                chunks.push({
                    id: this.generateId(),
                    content: chunkText,
                    embedding: [],
                    metadata: {
                        source: filename,
                        chunkIndex: Math.floor(i / chunkSize),
                    },
                });
            }
        }
        return chunks;
    }
    async generateEmbeddings(document) {
        this.logger.log(`Generating embeddings for ${document.chunks.length} chunks`);
        for (const chunk of document.chunks) {
            try {
                const response = await this.openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: chunk.content,
                });
                chunk.embedding = response.data[0].embedding;
            }
            catch (error) {
                this.logger.error(`Error generating embedding for chunk ${chunk.id}:`, error);
            }
        }
    }
    async storeInPinecone(document) {
        try {
            const indexName = process.env.PINECONE_INDEX_NAME || 'alphatechx-docs';
            const index = this.pinecone.index(indexName);
            const vectors = document.chunks
                .filter(chunk => chunk.embedding.length > 0)
                .map(chunk => ({
                id: chunk.id,
                values: chunk.embedding,
                metadata: {
                    content: chunk.content,
                    source: chunk.metadata.source,
                    chunkIndex: chunk.metadata.chunkIndex,
                    documentId: document.id,
                    documentType: document.type,
                },
            }));
            if (vectors.length > 0) {
                await index.upsert(vectors);
                this.logger.log(`Stored ${vectors.length} vectors in Pinecone for ${document.filename}`);
            }
        }
        catch (error) {
            this.logger.error(`Error storing in Pinecone:`, error);
            throw error;
        }
    }
    async searchSimilarContent(query, topK = 5) {
        try {
            const response = await this.openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: query,
            });
            const queryEmbedding = response.data[0].embedding;
            const indexName = process.env.PINECONE_INDEX_NAME || 'alphatechx-docs';
            const index = this.pinecone.index(indexName);
            const searchResponse = await index.query({
                vector: queryEmbedding,
                topK,
                includeMetadata: true,
            });
            return searchResponse.matches || [];
        }
        catch (error) {
            this.logger.error(`Error searching similar content:`, error);
            throw error;
        }
    }
    generateId() {
        return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.FileProcessorService = FileProcessorService;
exports.FileProcessorService = FileProcessorService = FileProcessorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileProcessorService);
//# sourceMappingURL=file-processor.service.js.map
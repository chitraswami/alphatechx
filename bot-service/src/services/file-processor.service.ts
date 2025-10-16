import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as sharp from 'sharp';

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

@Injectable()
export class FileProcessorService {
  private readonly logger = new Logger(FileProcessorService.name);
  private openai: OpenAI;
  private pinecone: Pinecone;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
      environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1-aws',
    });
  }

  async processFile(filePath: string, filename: string): Promise<ProcessedDocument> {
    this.logger.log(`Processing file: ${filename}`);
    
    const fileExtension = path.extname(filename).toLowerCase();
    let processedDoc: ProcessedDocument;

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

      // Generate embeddings for all chunks
      await this.generateEmbeddings(processedDoc);
      
      // Store in Pinecone
      await this.storeInPinecone(processedDoc);

      this.logger.log(`Successfully processed ${filename} with ${processedDoc.chunks.length} chunks`);
      return processedDoc;

    } catch (error) {
      this.logger.error(`Error processing file ${filename}:`, error);
      throw error;
    }
  }

  private async processPDF(filePath: string, filename: string): Promise<ProcessedDocument> {
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

  private async processDOCX(filePath: string, filename: string): Promise<ProcessedDocument> {
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

  private async processExcel(filePath: string, filename: string): Promise<ProcessedDocument> {
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

  private async processImage(filePath: string, filename: string): Promise<ProcessedDocument> {
    // First, optimize the image
    const optimizedBuffer = await sharp.default(filePath)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Use OpenAI Vision to analyze the image
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

  private async processText(filePath: string, filename: string): Promise<ProcessedDocument> {
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

  private chunkText(text: string, filename: string): DocumentChunk[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: DocumentChunk[] = [];
    const chunkSize = 3; // 3 sentences per chunk
    
    for (let i = 0; i < sentences.length; i += chunkSize) {
      const chunkText = sentences.slice(i, i + chunkSize).join('. ').trim();
      if (chunkText.length > 0) {
        chunks.push({
          id: this.generateId(),
          content: chunkText,
          embedding: [], // Will be filled by generateEmbeddings
          metadata: {
            source: filename,
            chunkIndex: Math.floor(i / chunkSize),
          },
        });
      }
    }
    
    return chunks;
  }

  private async generateEmbeddings(document: ProcessedDocument): Promise<void> {
    this.logger.log(`Generating embeddings for ${document.chunks.length} chunks`);
    
    for (const chunk of document.chunks) {
      try {
        const response = await this.openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk.content,
        });
        
        chunk.embedding = response.data[0].embedding;
      } catch (error) {
        this.logger.error(`Error generating embedding for chunk ${chunk.id}:`, error);
        // Continue with other chunks
      }
    }
  }

  private async storeInPinecone(document: ProcessedDocument): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Error storing in Pinecone:`, error);
      throw error;
    }
  }

  async searchSimilarContent(query: string, topK: number = 5): Promise<any[]> {
    try {
      // Generate embedding for the query
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
      });
      
      const queryEmbedding = response.data[0].embedding;
      
      // Search in Pinecone
      const indexName = process.env.PINECONE_INDEX_NAME || 'alphatechx-docs';
      const index = this.pinecone.index(indexName);
      
      const searchResponse = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });
      
      return searchResponse.matches || [];
    } catch (error) {
      this.logger.error(`Error searching similar content:`, error);
      throw error;
    }
  }

  private generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

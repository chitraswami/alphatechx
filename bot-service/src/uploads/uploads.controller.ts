import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Body,
  BadRequestException,
  Logger,
  Get,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../common/auth.guard';
import { FileProcessorService, ProcessedDocument } from '../services/file-processor.service';
import * as fs from 'fs';

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

@Controller('uploads')
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor(private fileProcessor: FileProcessorService) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  @Post('files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Allowed file types
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/vnd.ms-excel', // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'text/plain',
          'text/csv',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
        ];

        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException(`File type ${file.mimetype} not supported`), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 20, // Maximum 20 files
      },
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<UploadResponse> {
    this.logger.log(`Received ${files.length} files for processing`);

    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const response: UploadResponse = {
      success: true,
      message: `Processing ${files.length} files`,
      files: [],
    };

    // Process each file
    for (const file of files) {
      const fileInfo: FileResult = {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        status: 'processing',
      };

      try {
        this.logger.log(`Processing file: ${file.originalname}`);
        
        // Process the file with our FileProcessorService
        const processedDoc = await this.fileProcessor.processFile(file.path, file.originalname);
        
        fileInfo.status = 'completed';
        fileInfo.documentId = processedDoc.id;
        
        this.logger.log(`Successfully processed ${file.originalname} with ID ${processedDoc.id}`);
        
        // Clean up the uploaded file after processing
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          this.logger.warn(`Failed to cleanup file ${file.path}:`, cleanupError);
        }

      } catch (error: any) {
        this.logger.error(`Error processing file ${file.originalname}:`, error);
        fileInfo.status = 'failed';
        fileInfo.error = error.message || 'Processing failed';
        response.success = false;
      }

      response.files.push(fileInfo);
    }

    // Update response message based on results
    const completedCount = response.files.filter(f => f.status === 'completed').length;
    const failedCount = response.files.filter(f => f.status === 'failed').length;

    if (completedCount === files.length) {
      response.message = `Successfully processed all ${completedCount} files`;
    } else if (completedCount > 0) {
      response.message = `Processed ${completedCount} files successfully, ${failedCount} failed`;
    } else {
      response.message = `Failed to process all ${failedCount} files`;
      response.success = false;
    }

    return response;
  }

  @Get('status/:documentId')
  @UseGuards(JwtAuthGuard)
  async getDocumentStatus(@Param('documentId') documentId: string): Promise<any> {
    // In a real implementation, you would query the database for document status
    // For now, return a mock response
    return {
      documentId,
      status: 'completed',
      message: 'Document processed successfully',
      chunksCount: 15,
      embeddingsGenerated: true,
      storedInVectorDB: true,
    };
  }

  @Post('test-query')
  @UseGuards(JwtAuthGuard)
  async testQuery(@Body() body: { query: string }): Promise<any> {
    const { query } = body;

    if (!query) {
      throw new BadRequestException('Query is required');
    }

    try {
      this.logger.log(`Testing query: ${query}`);
      
      const results = await this.fileProcessor.searchSimilarContent(query, 5);
      
      return {
        success: true,
        query,
        resultsCount: results.length,
        results: results.map(result => ({
          score: result.score,
          content: result.metadata?.content?.substring(0, 200) + '...',
          source: result.metadata?.source,
          chunkIndex: result.metadata?.chunkIndex,
        })),
      };
    } catch (error: any) {
      this.logger.error(`Error testing query:`, error);
      throw new BadRequestException(`Query test failed: ${error.message || 'Unknown error'}`);
    }
  }
}

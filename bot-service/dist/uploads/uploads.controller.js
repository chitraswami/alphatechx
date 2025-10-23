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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UploadsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const auth_guard_1 = require("../common/auth.guard");
const file_processor_service_1 = require("../services/file-processor.service");
const fs = __importStar(require("fs"));
let UploadsController = UploadsController_1 = class UploadsController {
    constructor(fileProcessor) {
        this.fileProcessor = fileProcessor;
        this.logger = new common_1.Logger(UploadsController_1.name);
        this.uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }
    async uploadFiles(files) {
        this.logger.log(`Received ${files.length} files for processing`);
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const response = {
            success: true,
            message: `Processing ${files.length} files`,
            files: [],
        };
        for (const file of files) {
            const fileInfo = {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                status: 'processing',
            };
            try {
                this.logger.log(`Processing file: ${file.originalname}`);
                const processedDoc = await this.fileProcessor.processFile(file.path, file.originalname);
                fileInfo.status = 'completed';
                fileInfo.documentId = processedDoc.id;
                this.logger.log(`Successfully processed ${file.originalname} with ID ${processedDoc.id}`);
                try {
                    fs.unlinkSync(file.path);
                }
                catch (cleanupError) {
                    this.logger.warn(`Failed to cleanup file ${file.path}:`, cleanupError);
                }
            }
            catch (error) {
                this.logger.error(`Error processing file ${file.originalname}:`, error);
                fileInfo.status = 'failed';
                fileInfo.error = error.message || 'Processing failed';
                response.success = false;
            }
            response.files.push(fileInfo);
        }
        const completedCount = response.files.filter(f => f.status === 'completed').length;
        const failedCount = response.files.filter(f => f.status === 'failed').length;
        if (completedCount === files.length) {
            response.message = `Successfully processed all ${completedCount} files`;
        }
        else if (completedCount > 0) {
            response.message = `Processed ${completedCount} files successfully, ${failedCount} failed`;
        }
        else {
            response.message = `Failed to process all ${failedCount} files`;
            response.success = false;
        }
        return response;
    }
    async getDocumentStatus(documentId) {
        return {
            documentId,
            status: 'completed',
            message: 'Document processed successfully',
            chunksCount: 15,
            embeddingsGenerated: true,
            storedInVectorDB: true,
        };
    }
    async testQuery(body) {
        const { query } = body;
        if (!query) {
            throw new common_1.BadRequestException('Query is required');
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
        }
        catch (error) {
            this.logger.error(`Error testing query:`, error);
            throw new common_1.BadRequestException(`Query test failed: ${error.message || 'Unknown error'}`);
        }
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('files'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            const allowedTypes = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
                'text/csv',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
            ];
            if (allowedTypes.includes(file.mimetype)) {
                callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException(`File type ${file.mimetype} not supported`), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
            files: 20,
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Get)('status/:documentId'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "getDocumentStatus", null);
__decorate([
    (0, common_1.Post)('test-query'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "testQuery", null);
exports.UploadsController = UploadsController = UploadsController_1 = __decorate([
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [file_processor_service_1.FileProcessorService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map
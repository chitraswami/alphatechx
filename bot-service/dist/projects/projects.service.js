"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("../entities/project.entity");
const document_asset_entity_1 = require("../entities/document-asset.entity");
const training_job_entity_1 = require("../entities/training-job.entity");
let ProjectsService = class ProjectsService {
    constructor(projectRepo, docRepo, jobRepo) {
        this.projectRepo = projectRepo;
        this.docRepo = docRepo;
        this.jobRepo = jobRepo;
    }
    async getOrCreateDefaultProject(ownerUserId) {
        let project = await this.projectRepo.findOne({ where: { ownerUserId } });
        if (!project) {
            project = this.projectRepo.create({ ownerUserId, name: 'My Bot', plan: 'free' });
            await this.projectRepo.save(project);
        }
        return project;
    }
    async getOwnedProjectById(ownerUserId, id) {
        const project = await this.projectRepo.findOne({ where: { id } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.ownerUserId !== ownerUserId)
            throw new common_1.ForbiddenException('Not your project');
        return project;
    }
    async saveUploadedDocuments(projectId, files) {
        const assets = files.map((f) => this.docRepo.create({
            project: { id: projectId },
            fileName: f.originalname,
            mimeType: f.mimetype,
            sizeBytes: String(f.size),
            storageUrl: null,
        }));
        await this.docRepo.save(assets);
    }
    async queueTrainingJob(projectId) {
        const job = this.jobRepo.create({ project: { id: projectId }, status: 'queued' });
        return this.jobRepo.save(job);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(document_asset_entity_1.DocumentAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(training_job_entity_1.TrainingJob)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map
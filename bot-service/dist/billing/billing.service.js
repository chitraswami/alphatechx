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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("../entities/subscription.entity");
const project_entity_1 = require("../entities/project.entity");
let BillingService = class BillingService {
    constructor(subRepo, projectRepo) {
        this.subRepo = subRepo;
        this.projectRepo = projectRepo;
    }
    async startTrial(ownerUserId, plan) {
        let project = await this.projectRepo.findOne({ where: { ownerUserId } });
        if (!project) {
            project = this.projectRepo.create({ ownerUserId, name: 'My Bot', plan: 'free' });
            await this.projectRepo.save(project);
        }
        if (project.plan !== 'free' && project.trialEndsAt && project.trialEndsAt > new Date()) {
            throw new common_1.BadRequestException('Active trial already exists');
        }
        const now = new Date();
        const ends = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        project.plan = 'pro';
        project.trialEndsAt = ends;
        await this.projectRepo.save(project);
        const subscription = this.subRepo.create({
            project: { id: project.id },
            plan: 'pro',
            status: 'trialing',
            trialEndsAt: ends,
        });
        await this.subRepo.save(subscription);
        return project;
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map
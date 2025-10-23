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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const document_asset_entity_1 = require("./document-asset.entity");
const training_job_entity_1 = require("./training-job.entity");
const subscription_entity_1 = require("./subscription.entity");
const integration_installation_entity_1 = require("./integration-installation.entity");
let Project = class Project {
    constructor() {
        this.trialEndsAt = null;
    }
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'My Bot' }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "ownerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'free' }),
    __metadata("design:type", String)
], Project.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "trialEndsAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_asset_entity_1.DocumentAsset, (d) => d.project),
    __metadata("design:type", Array)
], Project.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => training_job_entity_1.TrainingJob, (t) => t.project),
    __metadata("design:type", Array)
], Project.prototype, "trainingJobs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscription_entity_1.Subscription, (s) => s.project),
    __metadata("design:type", Array)
], Project.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => integration_installation_entity_1.IntegrationInstallation, (i) => i.project),
    __metadata("design:type", Array)
], Project.prototype, "installations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
//# sourceMappingURL=project.entity.js.map
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
exports.IntegrationInstallation = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
let IntegrationInstallation = class IntegrationInstallation {
    constructor() {
        this.slackTeamId = null;
        this.slackBotToken = null;
        this.msTeamsTenantId = null;
        this.msTeamsBotId = null;
    }
};
exports.IntegrationInstallation = IntegrationInstallation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IntegrationInstallation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (p) => p.installations, { onDelete: 'CASCADE' }),
    __metadata("design:type", project_entity_1.Project)
], IntegrationInstallation.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IntegrationInstallation.prototype, "slackTeamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IntegrationInstallation.prototype, "slackBotToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IntegrationInstallation.prototype, "msTeamsTenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IntegrationInstallation.prototype, "msTeamsBotId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], IntegrationInstallation.prototype, "createdAt", void 0);
exports.IntegrationInstallation = IntegrationInstallation = __decorate([
    (0, typeorm_1.Entity)({ name: 'integration_installations' })
], IntegrationInstallation);
//# sourceMappingURL=integration-installation.entity.js.map
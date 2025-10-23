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
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("../entities/project.entity");
let IntegrationsService = class IntegrationsService {
    constructor(projectRepo) {
        this.projectRepo = projectRepo;
    }
    async getInstallUrls(ownerUserId, projectId) {
        const project = await this.projectRepo.findOne({ where: { id: projectId } });
        if (!project || project.ownerUserId !== ownerUserId) {
            throw new common_1.ForbiddenException('Not your project');
        }
        const slackClientId = process.env.SLACK_CLIENT_ID;
        const slackScopes = process.env.SLACK_SCOPES || 'commands,chat:write,app_mentions:read,channels:history,groups:history,im:history,mpim:history';
        const slackRedirect = process.env.SLACK_REDIRECT_URI || 'https://yourdomain.com/slack/oauth/callback';
        const teamsBotAppId = process.env.MS_TEAMS_BOT_APP_ID || '';
        const slack = slackClientId
            ? `https://slack.com/oauth/v2/authorize?client_id=${encodeURIComponent(slackClientId)}&scope=${encodeURIComponent(slackScopes)}&state=${encodeURIComponent(projectId)}&redirect_uri=${encodeURIComponent(slackRedirect)}`
            : undefined;
        const teams = teamsBotAppId
            ? `https://teams.microsoft.com/l/app/${encodeURIComponent(teamsBotAppId)}?installAppPackage=true&state=${encodeURIComponent(projectId)}`
            : undefined;
        return { slack, teams };
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map
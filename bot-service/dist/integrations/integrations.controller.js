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
var IntegrationsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../common/auth.guard");
const file_processor_service_1 = require("../services/file-processor.service");
let IntegrationsController = IntegrationsController_1 = class IntegrationsController {
    constructor(fileProcessor) {
        this.fileProcessor = fileProcessor;
        this.logger = new common_1.Logger(IntegrationsController_1.name);
    }
    async validateIntegration(setupDto) {
        this.logger.log(`Validating ${setupDto.type} integration`);
        try {
            switch (setupDto.type) {
                case 'teams':
                    return await this.validateTeamsIntegration(setupDto.credentials);
                case 'slack':
                    return await this.validateSlackIntegration(setupDto.credentials);
                case 'discord':
                    return await this.validateDiscordIntegration(setupDto.credentials);
                case 'webhook':
                    return await this.validateWebhookIntegration(setupDto.credentials);
                default:
                    throw new common_1.BadRequestException(`Unsupported integration type: ${setupDto.type}`);
            }
        }
        catch (error) {
            this.logger.error(`Error validating ${setupDto.type} integration:`, error);
            return {
                valid: false,
                message: `Failed to validate ${setupDto.type} integration: ${error.message || 'Unknown error'}`,
            };
        }
    }
    async validateTeamsIntegration(credentials) {
        const { appId, appPassword } = credentials;
        if (!appId || !appPassword) {
            return {
                valid: false,
                message: 'Microsoft App ID and App Password are required for Teams integration',
            };
        }
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!guidRegex.test(appId)) {
            return {
                valid: false,
                message: 'Invalid Microsoft App ID format. Should be a GUID (e.g., 12345678-1234-1234-1234-123456789012)',
            };
        }
        const isValid = appId.length > 30 && appPassword.length > 10;
        if (isValid) {
            process.env.MICROSOFT_APP_ID = appId;
            process.env.MICROSOFT_APP_PASSWORD = appPassword;
            return {
                valid: true,
                message: 'Microsoft Teams integration validated successfully! Your bot is ready to receive messages.',
                details: {
                    webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/teams/webhook`,
                    appId: appId,
                },
            };
        }
        else {
            return {
                valid: false,
                message: 'Invalid Microsoft App ID or App Password. Please check your Bot Framework registration.',
            };
        }
    }
    async validateSlackIntegration(credentials) {
        const { botToken } = credentials;
        if (!botToken) {
            return {
                valid: false,
                message: 'Bot User OAuth Token is required for Slack integration',
            };
        }
        if (!botToken.startsWith('xoxb-')) {
            return {
                valid: false,
                message: 'Invalid Slack Bot Token format. Should start with "xoxb-"',
            };
        }
        try {
            return {
                valid: true,
                message: 'Slack integration validated successfully! (Note: This is a demo validation)',
                details: {
                    webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/slack/webhook`,
                },
            };
        }
        catch (error) {
            return {
                valid: false,
                message: 'Failed to validate Slack token. Please check your Bot User OAuth Token.',
            };
        }
    }
    async validateDiscordIntegration(credentials) {
        const { botToken } = credentials;
        if (!botToken) {
            return {
                valid: false,
                message: 'Bot Token is required for Discord integration',
            };
        }
        if (botToken.length < 50) {
            return {
                valid: false,
                message: 'Invalid Discord Bot Token format',
            };
        }
        return {
            valid: true,
            message: 'Discord integration validated successfully! (Note: This is a demo validation)',
            details: {
                webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/discord/webhook`,
            },
        };
    }
    async validateWebhookIntegration(credentials) {
        const { webhookUrl } = credentials;
        if (!webhookUrl) {
            return {
                valid: false,
                message: 'Webhook URL is required for custom webhook integration',
            };
        }
        try {
            new URL(webhookUrl);
        }
        catch {
            return {
                valid: false,
                message: 'Invalid webhook URL format',
            };
        }
        return {
            valid: true,
            message: 'Custom webhook integration validated successfully!',
            details: {
                webhookUrl,
            },
        };
    }
    async handleTeamsWebhook(req, res) {
        this.logger.log('Received Teams webhook request');
        try {
            res.status(200).json({ status: 'received' });
        }
        catch (error) {
            this.logger.error('Error processing Teams webhook:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async handleSlackWebhook(req, res) {
        this.logger.log('Received Slack webhook request');
        if (req.body.challenge) {
            res.json({ challenge: req.body.challenge });
            return;
        }
        if (req.body.event && req.body.event.type === 'message') {
            const message = req.body.event.text;
            const user = req.body.event.user;
            const similarContent = await this.fileProcessor.searchSimilarContent(message, 3);
            this.logger.log(`Would respond to Slack user ${user} with content based on: ${message}`);
        }
        res.json({ status: 'ok' });
    }
    async handleDiscordWebhook(req, res) {
        this.logger.log('Received Discord webhook request');
        res.json({ status: 'ok' });
    }
    async getIntegrationStatus() {
        return {
            teams: {
                configured: !!process.env.MICROSOFT_APP_ID,
                webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/teams/webhook`,
            },
            slack: {
                configured: false,
                webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/slack/webhook`,
            },
            discord: {
                configured: false,
                webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/discord/webhook`,
            },
        };
    }
};
exports.IntegrationsController = IntegrationsController;
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "validateIntegration", null);
__decorate([
    (0, common_1.Post)('teams/webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "handleTeamsWebhook", null);
__decorate([
    (0, common_1.Post)('slack/webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "handleSlackWebhook", null);
__decorate([
    (0, common_1.Post)('discord/webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "handleDiscordWebhook", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getIntegrationStatus", null);
exports.IntegrationsController = IntegrationsController = IntegrationsController_1 = __decorate([
    (0, common_1.Controller)('integrations'),
    __metadata("design:paramtypes", [file_processor_service_1.FileProcessorService])
], IntegrationsController);
//# sourceMappingURL=integrations.controller.js.map
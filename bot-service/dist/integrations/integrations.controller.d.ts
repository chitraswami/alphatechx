import { Request, Response } from 'express';
import { FileProcessorService } from '../services/file-processor.service';
interface IntegrationSetupDto {
    type: 'slack' | 'teams' | 'discord' | 'webhook';
    credentials: {
        appId?: string;
        appPassword?: string;
        botToken?: string;
        webhookUrl?: string;
    };
}
interface IntegrationValidationResult {
    valid: boolean;
    message: string;
    details?: any;
}
export declare class IntegrationsController {
    private fileProcessor;
    private readonly logger;
    constructor(fileProcessor: FileProcessorService);
    validateIntegration(setupDto: IntegrationSetupDto): Promise<IntegrationValidationResult>;
    private validateTeamsIntegration;
    private validateSlackIntegration;
    private validateDiscordIntegration;
    private validateWebhookIntegration;
    handleTeamsWebhook(req: Request, res: Response): Promise<void>;
    handleSlackWebhook(req: Request, res: Response): Promise<void>;
    handleDiscordWebhook(req: Request, res: Response): Promise<void>;
    getIntegrationStatus(): Promise<any>;
}
export {};

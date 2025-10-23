import { ActivityHandler, BotFrameworkAdapter } from 'botbuilder';
import { FileProcessorService } from './file-processor.service';
export declare class TeamsBotService extends ActivityHandler {
    private fileProcessor;
    private readonly logger;
    private openai;
    private adapter;
    private conversationState;
    private userState;
    constructor(fileProcessor: FileProcessorService);
    private handleMessage;
    private generateResponse;
    validateTeamsCredentials(appId: string, appPassword: string): Promise<boolean>;
    getBotAdapter(): BotFrameworkAdapter;
    processWebhook(req: any, res: any): Promise<void>;
}

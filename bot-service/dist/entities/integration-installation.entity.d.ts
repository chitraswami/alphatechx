import { Project } from './project.entity';
export declare class IntegrationInstallation {
    id: string;
    project: Project;
    slackTeamId: string | null;
    slackBotToken: string | null;
    msTeamsTenantId: string | null;
    msTeamsBotId: string | null;
    createdAt: Date;
}

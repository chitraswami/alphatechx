import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class IntegrationsService {
  constructor(@InjectRepository(Project) private readonly projectRepo: Repository<Project>) {}

  async getInstallUrls(ownerUserId: string, projectId: string) {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project || project.ownerUserId !== ownerUserId) {
      throw new ForbiddenException('Not your project');
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
} 
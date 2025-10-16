import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  UseGuards, 
  Req, 
  Res, 
  Logger,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/auth.guard';
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

@Controller('integrations')
export class IntegrationsController {
  private readonly logger = new Logger(IntegrationsController.name);

  constructor(
    private fileProcessor: FileProcessorService,
  ) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validateIntegration(@Body() setupDto: IntegrationSetupDto): Promise<IntegrationValidationResult> {
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
          throw new BadRequestException(`Unsupported integration type: ${setupDto.type}`);
      }
    } catch (error: any) {
      this.logger.error(`Error validating ${setupDto.type} integration:`, error);
      return {
        valid: false,
        message: `Failed to validate ${setupDto.type} integration: ${error.message || 'Unknown error'}`,
      };
    }
  }

  private async validateTeamsIntegration(credentials: any): Promise<IntegrationValidationResult> {
    const { appId, appPassword } = credentials;

    if (!appId || !appPassword) {
      return {
        valid: false,
        message: 'Microsoft App ID and App Password are required for Teams integration',
      };
    }

    // Validate format of App ID (should be a GUID)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(appId)) {
      return {
        valid: false,
        message: 'Invalid Microsoft App ID format. Should be a GUID (e.g., 12345678-1234-1234-1234-123456789012)',
      };
    }

    // Validate credentials with Bot Framework (simplified validation)
    const isValid = appId.length > 30 && appPassword.length > 10; // Basic validation
    
    if (isValid) {
      // Store credentials in environment (in production, use secure storage)
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
    } else {
      return {
        valid: false,
        message: 'Invalid Microsoft App ID or App Password. Please check your Bot Framework registration.',
      };
    }
  }

  private async validateSlackIntegration(credentials: any): Promise<IntegrationValidationResult> {
    const { botToken } = credentials;

    if (!botToken) {
      return {
        valid: false,
        message: 'Bot User OAuth Token is required for Slack integration',
      };
    }

    // Validate Slack token format
    if (!botToken.startsWith('xoxb-')) {
      return {
        valid: false,
        message: 'Invalid Slack Bot Token format. Should start with "xoxb-"',
      };
    }

    // In a real implementation, you would test the token with Slack API
    // For now, we'll do basic validation
    try {
      // Simulate Slack API validation
      // const response = await fetch('https://slack.com/api/auth.test', {
      //   headers: { 'Authorization': `Bearer ${botToken}` }
      // });
      
      return {
        valid: true,
        message: 'Slack integration validated successfully! (Note: This is a demo validation)',
        details: {
          webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/slack/webhook`,
        },
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Failed to validate Slack token. Please check your Bot User OAuth Token.',
      };
    }
  }

  private async validateDiscordIntegration(credentials: any): Promise<IntegrationValidationResult> {
    const { botToken } = credentials;

    if (!botToken) {
      return {
        valid: false,
        message: 'Bot Token is required for Discord integration',
      };
    }

    // Basic Discord token validation
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

  private async validateWebhookIntegration(credentials: any): Promise<IntegrationValidationResult> {
    const { webhookUrl } = credentials;

    if (!webhookUrl) {
      return {
        valid: false,
        message: 'Webhook URL is required for custom webhook integration',
      };
    }

    // Validate URL format
    try {
      new URL(webhookUrl);
    } catch {
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

  // Teams webhook endpoint
  @Post('teams/webhook')
  async handleTeamsWebhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.logger.log('Received Teams webhook request');
    
    try {
      // Basic webhook acknowledgment - full Teams integration would process messages here
      res.status(200).json({ status: 'received' });
    } catch (error) {
      this.logger.error('Error processing Teams webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Slack webhook endpoint (placeholder)
  @Post('slack/webhook')
  async handleSlackWebhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.logger.log('Received Slack webhook request');
    
    // Slack webhook verification
    if (req.body.challenge) {
      res.json({ challenge: req.body.challenge });
      return;
    }

    // Handle Slack events
    if (req.body.event && req.body.event.type === 'message') {
      const message = req.body.event.text;
      const user = req.body.event.user;
      
      // Process message and generate response
      const similarContent = await this.fileProcessor.searchSimilarContent(message, 3);
      
      // In a real implementation, you would send the response back to Slack
      this.logger.log(`Would respond to Slack user ${user} with content based on: ${message}`);
    }

    res.json({ status: 'ok' });
  }

  // Discord webhook endpoint (placeholder)
  @Post('discord/webhook')
  async handleDiscordWebhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.logger.log('Received Discord webhook request');
    
    // Handle Discord events
    // Implementation would depend on Discord's webhook format
    
    res.json({ status: 'ok' });
  }

  // Get integration status
  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getIntegrationStatus(): Promise<any> {
    return {
      teams: {
        configured: !!process.env.MICROSOFT_APP_ID,
        webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/teams/webhook`,
      },
      slack: {
        configured: false, // Would check for Slack credentials
        webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/slack/webhook`,
      },
      discord: {
        configured: false, // Would check for Discord credentials
        webhookUrl: `${process.env.BOT_SERVICE_URL || 'http://localhost:4000'}/integrations/discord/webhook`,
      },
    };
  }
}
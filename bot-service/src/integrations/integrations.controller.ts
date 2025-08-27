import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/user.decorator';
import { IntegrationsService } from './integrations.service';

@Controller('projects/:id/integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('install-urls')
  async getInstallUrls(@Param('id') id: string, @CurrentUser() user: any) {
    return this.integrationsService.getInstallUrls(user.id, id);
  }
} 
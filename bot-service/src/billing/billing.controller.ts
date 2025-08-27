import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/user.decorator';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('start-trial')
  async startTrial(@Body('plan') plan: 'pro', @CurrentUser() user: any) {
    const project = await this.billingService.startTrial(user.id, plan);
    return { project };
  }
} 
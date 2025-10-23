import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    startTrial(plan: 'pro', user: any): Promise<{
        project: import("../entities/project.entity").Project;
    }>;
}

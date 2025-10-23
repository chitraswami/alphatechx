import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { Project } from '../entities/project.entity';
export declare class BillingService {
    private readonly subRepo;
    private readonly projectRepo;
    constructor(subRepo: Repository<Subscription>, projectRepo: Repository<Project>);
    startTrial(ownerUserId: string, plan: 'pro'): Promise<Project>;
}

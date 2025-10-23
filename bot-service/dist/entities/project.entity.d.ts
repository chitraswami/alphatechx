import { DocumentAsset } from './document-asset.entity';
import { TrainingJob } from './training-job.entity';
import { Subscription } from './subscription.entity';
import { IntegrationInstallation } from './integration-installation.entity';
export type PlanType = 'free' | 'pro' | 'enterprise';
export declare class Project {
    id: string;
    name: string;
    ownerUserId: string;
    plan: PlanType;
    trialEndsAt: Date | null;
    documents: DocumentAsset[];
    trainingJobs: TrainingJob[];
    subscriptions: Subscription[];
    installations: IntegrationInstallation[];
    createdAt: Date;
    updatedAt: Date;
}

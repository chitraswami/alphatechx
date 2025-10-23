import { Project, PlanType } from './project.entity';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
export declare class Subscription {
    id: string;
    project: Project;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    plan: PlanType;
    status: SubscriptionStatus;
    trialEndsAt: Date | null;
    currentPeriodEnd: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

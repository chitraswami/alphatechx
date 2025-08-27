import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Subscription) private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
  ) {}

  async startTrial(ownerUserId: string, plan: 'pro'): Promise<Project> {
    let project = await this.projectRepo.findOne({ where: { ownerUserId } });
    if (!project) {
      project = this.projectRepo.create({ ownerUserId, name: 'My Bot', plan: 'free' });
      await this.projectRepo.save(project);
    }

    // If already on pro or enterprise, disallow
    if (project.plan !== 'free' && project.trialEndsAt && project.trialEndsAt > new Date()) {
      throw new BadRequestException('Active trial already exists');
    }

    const now = new Date();
    const ends = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    project.plan = 'pro';
    project.trialEndsAt = ends;
    await this.projectRepo.save(project);

    const subscription = this.subRepo.create({
      project: { id: project.id } as Project,
      plan: 'pro',
      status: 'trialing',
      trialEndsAt: ends,
    });
    await this.subRepo.save(subscription);

    return project;
  }
} 
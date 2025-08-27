import { Controller, Get, Param, Post, UseGuards, Req, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/user.decorator';
import { ProjectsService } from './projects.service';
import { Request } from 'express';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('get-or-create')
  async getOrCreate(@CurrentUser() user: any) {
    const project = await this.projectsService.getOrCreateDefaultProject(user.id);
    return { project };
  }

  @Get(':id')
  async getProject(@Param('id') id: string, @CurrentUser() user: any) {
    const project = await this.projectsService.getOwnedProjectById(user.id, id);
    return { project };
  }

  @Post(':id/documents/upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadDocuments(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    if (!files || files.length === 0) throw new BadRequestException('No files uploaded');
    const project = await this.projectsService.getOwnedProjectById(user.id, id);
    await this.projectsService.saveUploadedDocuments(project.id, files);
    return { success: true };
  }

  @Post(':id/train')
  async train(@Param('id') id: string, @CurrentUser() user: any) {
    const project = await this.projectsService.getOwnedProjectById(user.id, id);
    const job = await this.projectsService.queueTrainingJob(project.id);
    return { success: true, jobId: job.id };
  }
} 
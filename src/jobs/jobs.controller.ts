import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('all')
  async getAllJobs(@Query() query, @Req() req, @Res() res) {
    try {
      const jobs = await this.jobsService.getAllJobs(query);
      return res.status(200).json({
        message: 'Jobs retrieved successfully',
        jobs,
      });
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      return res.status(400).json({
        message: 'Error retrieving jobs',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async getJobById(@Query('id') id: number, @Req() req, @Res() res) {
    try {
      const job = await this.jobsService.getJobById(id);
      return res.status(200).json({
        message: 'Job retrieved successfully',
        job,
      });
    } catch (error) {
      console.error('Error retrieving job:', error);
      return res.status(400).json({
        message: 'Error retrieving job',
        error: error.message,
      });
    }
  }

  @Post('create')
  async createJob(@Body() body, @Req() req, @Res() res) {
    try {
      const userType = req.user.userType;
      if (userType !== 'recruiter') {
        return res.status(403).json({
          message: 'Forbidden: Only recruiters can create jobs',
        });
      }
      const job = await this.jobsService.createJob(req.user.id, body);
      return res.status(201).json({
        message: 'Job created successfully',
        job,
      });
    } catch (error) {
      console.error('Error creating job:', error);
      return res.status(400).json({
        message: 'Error creating job',
        error: error.message,
      });
    }
  }

  @Post('apply')
  async applyJob(@Body() body, @Req() req, @Res() res) {
    try {
      const userType = req.user.userType;
      if (userType !== 'user') {
        return res.status(403).json({
          message: 'Forbidden: Only candidates can apply for jobs',
        });
      }
      const application = await this.jobsService.applyJob(
        req.user.id,
        body.jobId,
      );
      return res.status(201).json({
        message: 'Job application submitted successfully',
        application,
      });
    } catch (error) {
      console.error('Error applying for job:', error);
      return res.status(400).json({
        message: 'Error applying for job',
        error: error.message,
      });
    }
  }

  @Get('applied')
  async getAppliedJobs(@Query() query, @Req() req, @Res() res) {
    try {
      const userType = req.user.userType;
      if (userType !== 'user') {
        return res.status(403).json({
          message: 'Forbidden: Only candidates can view applied jobs',
        });
      }
      const jobs = await this.jobsService.getAppliedJobs(query, req.user.id);
      return res.status(200).json({
        message: 'Applied jobs retrieved successfully',
        jobs,
      });
    } catch (error) {
      console.error('Error retrieving applied jobs:', error);
      return res.status(400).json({
        message: 'Error retrieving applied jobs',
        error: error.message,
      });
    }
  }

  @Post('applications')
  async getJobApplications(@Query() query, @Body() body, @Req() req, @Res() res) {
    try {
      const userType = req.user.userType;
      if (userType !== 'recruiter') {
        return res.status(403).json({
          message: 'Forbidden: Only recruiters can view job applications',
        });
      }
      const applications = await this.jobsService.getJobApplications(
        query,
        body.jobId
      );
      return res.status(200).json({
        message: 'Job applications retrieved successfully',
        applications,
      });
    } catch (error) {
      console.error('Error retrieving job applications:', error);
      return res.status(400).json({
        message: 'Error retrieving job applications',
        error: error.message,
      });
    }
  }
}

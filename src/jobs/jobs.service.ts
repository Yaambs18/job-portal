import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './jobs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async getAllJobs(query: any): Promise<any> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const [jobsList, total] = await this.jobRepository.findAndCount({
        skip,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        total,
        totalPages: Math.ceil(total / limit),
        jobs: jobsList,
      };
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      throw new Error('Error retrieving jobs');
    }
  }

  async getJobById(id: number): Promise<any> {
    try {
      const job = await this.jobRepository.findOne({
        where: { id },
      });
      if (!job) {
        throw new Error('Job not found');
      }
      return job;
    } catch (error) {
      console.error('Error retrieving job:', error);
      throw new Error('Error retrieving job');
    }
  }

  async createJob(recruiterId: number, body: any): Promise<any> {
    try {
      if (!body.title || !body.description) {
        throw new Error('Missing required fields');
      }

      const job = await this.jobRepository.save({
        ...body,
        recruiterId,
      });

      return job;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Error creating job');
    }
  }

  async applyJob(candidateId: number, jobId: number): Promise<any> {
    try {
      const job = await this.jobRepository.findOne({
        where: { id: jobId },
        relations: ['candidates'],
      });
      if (!job) {
        throw new Error('Job not found');
      }

      if (job.candidates.some((candidate) => candidate.id === candidateId)) {
        throw new Error('Candidate already applied for this job');
      }

      job.candidates.push({ id: candidateId } as any);
      await this.jobRepository.save(job);

      return job;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw new Error('Error applying for job');
    }
  }

  async getAppliedJobs(query: any, candidateId: number): Promise<any> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;
      const [jobs, total] = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.candidates', 'candidate')
        .where('candidate.id = :candidateId', { candidateId })
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        total,
        totalPages: Math.ceil(total / limit),
        jobs,
      };
    } catch (error) {
      console.error('Error retrieving applied jobs:', error);
      throw new Error('Error retrieving applied jobs');
    }
  }

  async getJobApplications(query: any, jobId: number): Promise<any> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;
      const [candidates, total] = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.candidates', 'candidate')
        .where('job.id = :jobId', { jobId })
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        total,
        totalPages: Math.ceil(total / limit),
        candidates,
      };
    } catch (error) {
      console.error('Error retrieving job applications:', error);
      throw new Error('Error retrieving job applications');
    }
  }
}

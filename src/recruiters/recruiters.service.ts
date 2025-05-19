import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruiter } from './recruiters.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class RecruitersService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    private readonly commonService: CommonService,
  ) {}

  async registerRecruiter(recruiterData: any): Promise<any> {
    try {
      if (
        !recruiterData.name ||
        !recruiterData.email ||
        !recruiterData.password
      ) {
        throw new Error('Missing required fields');
      }
      if (recruiterData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recruiterData.email)) {
        throw new Error('Invalid email format');
      }
      if (!/^\d{10}$/.test(recruiterData.phone)) {
        throw new Error('Phone number must be 10 digits long');
      }

      // check if email already registered
      const existingRecruiter = await this.recruiterRepository.findOne({
        where: { email: recruiterData.email },
      });
      if (existingRecruiter) {
        throw new Error('Email already registered');
      }

      const saltRounds = 10;
      recruiterData.password = await bcrypt.hash(
        recruiterData.password,
        saltRounds,
      );

      const recruiter = await this.recruiterRepository.save(recruiterData);
      delete recruiter.password;
      delete recruiter.createdAt;
      delete recruiter.updatedAt;

      return recruiter;
    } catch (error) {
      console.error('Error registering recruiter:', error);
      throw new Error('Error registering recruiter');
    }
  }

  async loginRecruiter(email: string, password: string): Promise<any> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { email },
      });
      if (!recruiter) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        recruiter.password,
      );
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      const userToken = await this.commonService.generateAccessToken(
        recruiter,
        '3h',
        'recruiter',
      );

      delete recruiter.password;
      delete recruiter.createdAt;
      delete recruiter.updatedAt;

      return { recruiter, userToken };
    } catch (error) {
      console.error('Error logging in recruiter:', error);
      throw new Error('Error logging in recruiter');
    }
  }

  async findById(id: number): Promise<Recruiter | null> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id },
      });
      if (!recruiter) {
        throw new Error('Recruiter not found');
      }
      delete recruiter.password;
      delete recruiter.createdAt;
      delete recruiter.updatedAt;

      return recruiter;
    } catch (error) {
      console.error('Error retrieving recruiter:', error);
      throw new Error('Error retrieving recruiter');
    }
  }

  async logoutRecruiter(recruiterId: number): Promise<any> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
      });
      if (!recruiter) {
        throw new Error('Recruiter not found');
      }

      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Error logging out recruiter:', error);
      throw new Error('Error logging out recruiter');
    }
  }
}

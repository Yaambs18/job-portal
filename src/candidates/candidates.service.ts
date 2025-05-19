import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidates.entity';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly commonService: CommonService,
  ) {}

  async registerCandidate(candidateData: any): Promise<any> {
    try {
      if (
        !candidateData.name ||
        !candidateData.email ||
        !candidateData.password
      ) {
        throw new Error('Missing required fields');
      }
      if (candidateData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateData.email)) {
        throw new Error('Invalid email format');
      }
      if (!/^\d{10}$/.test(candidateData.phone)) {
        throw new Error('Phone number must be 10 digits long');
      }

      // check if email already registered
      const existingCandidate = await this.candidateRepository.findOne({
        where: { email: candidateData.email },
      });
      if (existingCandidate) {
        throw new Error('Email already registered');
      }

      // encrypting user password for privacy
      const saltRounds = 10;
      candidateData.password = await bcrypt.hash(
        candidateData.password,
        saltRounds,
      );

      const candidate = await this.candidateRepository.save(candidateData);

      delete candidate.password;
      delete candidate.createdAt;
      delete candidate.updatedAt;

      return candidate;
    } catch (error) {
      console.error('Error registering candidate:', error);
      throw new Error('Error registering candidate');
    }
  }

  async loginCandidate(email: string, password: string): Promise<any | null> {
    try {
      const candidate = await this.candidateRepository.findOne({
        where: { email },
      });
      if (!candidate) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        candidate.password,
      );
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      delete candidate.password;
      delete candidate.createdAt;
      delete candidate.updatedAt;

      const userToken = await this.commonService.generateAccessToken(candidate, '3h');

      return { candidate, userToken };
    } catch (error) {
      console.error('Error logging in candidate:', error);
      throw new Error('Error logging in candidate');
    }
  }

  async findById(id: number): Promise<Candidate | null> {
    try {
      const candidate = await this.candidateRepository.findOne({
        where: { id },
      });
      if (!candidate) {
        throw new Error('Candidate not found');
      }
      delete candidate.password;
      delete candidate.createdAt;
      delete candidate.updatedAt;

      return candidate;
    } catch (error) {
      console.error('Error finding candidate:', error);
      throw new Error('Error finding candidate');
    }
  }

  async logoutCandidate(id: number): Promise<any> {
    try {
      const candidate = await this.candidateRepository.findOne({
        where: { id },
      });
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Error logging out candidate:', error);
      throw new Error('Error logging out candidate');
    }
  }
}

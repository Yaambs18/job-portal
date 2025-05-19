import { Candidate } from 'src/candidates/candidates.entity';
import { Recruiter } from 'src/recruiters/recruiters.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'recruiterId', nullable: false })
  recruiterId: number;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobs)
  recruiter: Recruiter;

  @ManyToMany(type => Candidate)
  @JoinTable({
    name: 'job_candidates',
    joinColumn: { name: 'jobId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'candidateId', referencedColumnName: 'id' },
  })
  candidates: Candidate[];
}

import { Job } from 'src/jobs/jobs.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'candidates' })
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(type => Job)
  @JoinTable({
    name: 'job_candidates',
    joinColumn: { name: 'candidateId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'jobId', referencedColumnName: 'id' },
  })
  appliedJobs: Job[];
}

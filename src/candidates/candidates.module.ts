import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './candidates.entity';
import { CommonsModule } from 'src/common/common.module';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService],
  imports: [TypeOrmModule.forFeature([Candidate]), CommonsModule],
  exports: [CandidatesService],
})
export class CandidatesModule {}

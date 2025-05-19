import { Module } from '@nestjs/common';
import { RecruitersService } from './recruiters.service';
import { RecruitersController } from './recruiters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from './recruiters.entity';
import { CommonsModule } from 'src/common/common.module';

@Module({
  controllers: [RecruitersController],
  providers: [RecruitersService],
  imports: [TypeOrmModule.forFeature([Recruiter]), CommonsModule],
  exports: [RecruitersService],
})
export class RecruitersModule {}

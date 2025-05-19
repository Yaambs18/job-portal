import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CandidatesService } from 'src/candidates/candidates.service';
import { CommonService } from 'src/common/common.service';
import { RecruitersService } from 'src/recruiters/recruiters.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly common: CommonService,
    private readonly candidatesService: CandidatesService,
    private readonly recruiterService: RecruitersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user: any = await this.getPayload(context);
    try {
      if (user) {
        request.user = user;
        let userData: any = null;
        if (user.id && user.userType === 'user') {
          userData = await this.candidatesService.findById(user.id);
        } else if (user.id && user.userType === 'recruiter') {
          userData = await this.recruiterService.findById(user.id);
        }
        if (!userData) {
          return false;
        } else {
          return true;
        }
      } else {
        //user not found
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getPayload(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request && request.headers.authorization) {
      const authorization = request.headers.authorization.split(' ')[1];
      try {
        return await this.common.jwtVerify(authorization);
      } catch (e) {
        throw new UnauthorizedException('Unauthorized Get Payload');
      }
    }
  }
}

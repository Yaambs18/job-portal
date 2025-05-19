import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CommonService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(
    user: any,
    expiresIn: string = '3h',
    userType: string = 'user',
  ) {
    try {
      const secret = process.env.JWT_SECRET;
      const payload = { id: user.id, email: user.email, userType };

      const token = await this.jwtService.sign(payload, { secret, expiresIn });
      return token;
    } catch (error) {
      console.error('Error generating access token:', error);
      throw new Error('Error generating access token');
    }
  }

  getPayload(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request && request.headers.authorization) {
      const authorization = request.headers.authorization.split(' ')[1];
      try {
        return this.jwtVerify(authorization);
      } catch (e) {
        throw new UnauthorizedException('Unauthorized Get Payload');
      }
    }
  }

  async jwtVerify(token: string) {
    try {
      const secret = process.env.JWT_SECRET;
      return await this.jwtService.verify(token, { secret });
    } catch (error) {
      console.error('Error verifying JWT:', error);
      throw new Error('Error verifying JWT');
    }
  }
}

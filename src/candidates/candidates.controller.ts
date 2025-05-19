import { Body, Controller, Post, Res } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Public()
  @Post('register')
  async registerCandidate(@Body() body, @Res() res) {
    try {
      const candidate = await this.candidatesService.registerCandidate(body);
      return res.status(201).json({
        message: 'Candidate registered successfully',
        candidate,
      });
    } catch (error) {
      console.error('Error registering candidate:', error);
      return res.status(400).json({
        message: 'Error registering candidate',
        error: error.message,
      });
    }
  }


  @Public()
  @Post('login')
  async loginCandidate(@Body() body, @Res() res) {
    try {
      const { email, password } = body;
      const candidate = await this.candidatesService.loginCandidate(
        email,
        password,
      );
      return res.status(200).json({
        message: 'Login successful',
        candidate,
      });
    } catch (error) {
      console.error('Error logging in candidate:', error);
      return res.status(400).json({
        message: 'Error logging in candidate',
        error: error.message,
      });
    }
  }

  @Post('logout')
  async logoutCandidate(@Body() body, @Res() res) {
    try {
      const { candidateId } = body;
      await this.candidatesService.logoutCandidate(candidateId);
      return res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Error logging out candidate:', error);
      return res.status(400).json({
        message: 'Error logging out candidate',
        error: error.message,
      });
    }
  }
}

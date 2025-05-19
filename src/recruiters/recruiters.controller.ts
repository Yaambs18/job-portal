import { Body, Controller, Post, Res } from '@nestjs/common';
import { RecruitersService } from './recruiters.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Public()
  @Post('register')
  async registerRecruiter(@Body() body, @Res() res) {
    try {
      const recruiter = await this.recruitersService.registerRecruiter(body);
      return res.status(201).json({
        message: 'Recruiter registered successfully',
        recruiter,
      });
    } catch (error) {
      console.error('Error registering recruiter:', error);
      return res.status(400).json({
        message: 'Error registering recruiter',
        error: error.message,
      });
    }
  }

  @Public()
  @Post('login')
  async loginRecruiter(@Body() body, @Res() res) {
    try {
      const { email, password } = body;
      const recruiter = await this.recruitersService.loginRecruiter(
        email,
        password,
      );
      return res.status(200).json({
        message: 'Login successful',
        recruiter,
      });
    } catch (error) {
      console.error('Error logging in recruiter:', error);
      return res.status(400).json({
        message: 'Error logging in recruiter',
        error: error.message,
      });
    }
  }

  @Post('logout')
  async logoutRecruiter(@Body() body, @Res() res) {
    try {
      const { recruiterId } = body;
      await this.recruitersService.logoutRecruiter(recruiterId);
      return res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Error logging out recruiter:', error);
      return res.status(400).json({
        message: 'Error logging out recruiter',
        error: error.message,
      });
    }
  }
}

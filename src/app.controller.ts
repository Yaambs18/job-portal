import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
  ) { }
  @Public()
  @Get()
  async index(): Promise<string> {
    return 'Job Portal Server!!!';
  }

}

import { Request, Controller, Get } from '@nestjs/common';

@Controller()
export class AboutController {
  @Get('about.json')
  getAbout() {
    return {
      message: 'This is the about endpoint',
      version: '1.0.0',
      author: 'Your Name',
    };
  }
}

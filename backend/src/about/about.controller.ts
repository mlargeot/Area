import { Controller, Get, HttpCode, Request } from '@nestjs/common';
import { AboutService } from './about.service';

@Controller()
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('about.json')
  @HttpCode(200)
  async getAbout(@Request() req) {
    const clientIp: string = req.ip.split(":")[3];
    return await this.aboutService.getFormatedAbout(clientIp);
  }
}

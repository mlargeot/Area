import { Controller, Get, Request } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ReactionsService } from './reactions.service'


@Controller()
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get('reactions')
  @ApiResponse({ status: 200 })
  async getreactions(@Request() req) {
    return this.reactionsService.getDefaultReactions();
  }
}

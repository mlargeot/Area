import { Controller, Get, Post, Request } from '@nestjs/common';
import { GithubActionsService } from './github.actions.service';
import { ApiResponse } from '@nestjs/swagger';


@Controller('actions/github')
export class GithubActionsController {
  constructor(private readonly GithubActionsService: GithubActionsService) {}

  @Post('assign')
  @ApiResponse({ status: 200 })
  async assignWebhook(@Request() req) {
    return this.GithubActionsService.triggerAssign()
  }

  @Post('hook')
  async initAssignWebhook(@Request() req) {
    return this.GithubActionsService.init_assign("maxence1.largeot@epitech.eu", req.body);
  }
}

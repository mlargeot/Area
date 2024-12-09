import { Controller, Get, Post, Request } from '@nestjs/common';
import { GithubActionsService } from './github.actions.service';
import { ApiResponse } from '@nestjs/swagger';
import { ActionsService } from '../actions.service';


@Controller('actions/github')
export class GithubActionsController {
  constructor(private readonly GithubActionsService: GithubActionsService) {}

  @Post('assign')
  @ApiResponse({ status: 200 })
  async assignWebhook(@Request() req) {
    return this.GithubActionsService.triggerAssign()
  }
}

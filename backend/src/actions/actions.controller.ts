import { Controller, Get, Request, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger'
import { ActionsService } from './actions.service';
import { GithubActionsService } from './github/github.actions.service';


@Controller()
export class ActionsController {
  constructor(private readonly actionsService: ActionsService,
    private readonly githubActionService: GithubActionsService
  ) {}

  @Get('actions')
  @ApiResponse({ status: 200 })
  async getactions(@Request() req) {
    return this.actionsService.getDefaultActions();
  }
}

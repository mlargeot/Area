import { Controller, Get, Request } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger'
import { ActionsService } from './actions.service';


@Controller()
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('actions')
  @ApiResponse({ status: 200 })
  async getactions(@Request() req) {
    return this.actionsService.getDefaultActions();
  }
}

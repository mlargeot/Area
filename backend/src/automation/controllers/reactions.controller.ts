import { Controller, Get, Request } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ReactionsService } from 'src/automation/services/default.reaction.service'


@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get()
  @ApiOkResponse({description: "Reactions list found."})
  async getReactions() {
    return this.reactionsService.getDefaultReactions();
  }
}

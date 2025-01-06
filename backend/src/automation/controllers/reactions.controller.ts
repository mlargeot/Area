import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ReactionsDto } from 'src/automation/dto/automation.dto';
import { ReactionsService } from 'src/automation/services/default.reaction.service'


@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get()
  @ApiOkResponse({description: "Reactions list found."})
  async getReactions() {
    return this.reactionsService.getDefaultReactions();
  }

  @Get(':service')
  @ApiOkResponse({description: "Reactions found for the requested service.", type: [ReactionsDto]})
  @ApiNotFoundResponse({description: "Requested service not found."})
  async getServiceReactions(
    @Param('service') service: string
  ) {
    return this.reactionsService.getServiceReactions(service);
  }
}

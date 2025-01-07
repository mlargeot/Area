import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger'
import { ActionsService } from 'src/automation/services/default.action.service';
import { ActionsDto } from 'src/automation/dto/automation.dto';


@Controller('actions')
export class ActionsController {
  constructor(
    private readonly actionsService: ActionsService,
  ) {}

  @Get()
  @ApiOkResponse({ description: "Actions list found." })
  async getActions() {
    return this.actionsService.getDefaultActions();
  }

  @Get(':service')
    @ApiOkResponse({description: "Reactions found for the requested service.", type: [ActionsDto]})
    @ApiNotFoundResponse({description: "Requested service not found."})
    async getServiceReactions(
      @Param('service') service: string
    ) {
      return this.actionsService.getServiceActions(service);
    }
}

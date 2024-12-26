import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse} from '@nestjs/swagger'
import { ActionsService } from 'src/automation/services/default.action.service';


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
}

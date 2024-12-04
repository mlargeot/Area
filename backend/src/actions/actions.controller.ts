import { Controller, Get, HttpCode, Request } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsDto } from './dto/default_actions.dto';


const defaultActions: Array<{
    service: string;
    actions: Array<ActionsDto>;
  }> = [
    {
      service: "discord",
      actions: [
        {
          name: "mention_recieved",
          description: "A mention is recieved on a discord server.",
          argumentsNumber: 0,
          argumentsExample: [],
        },
      ],
    },
  ];


@Controller()
export class actionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('actions')
  @HttpCode(200)
  async getactions(@Request() req) {
    return defaultActions;
  }
}

import { Injectable } from '@nestjs/common';
import { ActionsDto } from './dto/default_actions.dto';

@Injectable()
export class ActionsService {
  private defaultActions: Array<{
    service: string;
    actions: Array<ActionsDto>;
  }> = [
    {
      service: "github",
      actions: [
        {
          name: "issue_assigned",
          description: "Triggered when an issue is assigned to the user.",
          argumentsNumber: 0,
          argumentsExample: [],
        },
      ],
    }
  ];

  getDefaultActions() {
    return this.defaultActions;
  }
}

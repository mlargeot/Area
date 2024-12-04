import { Injectable } from '@nestjs/common';
import { ActionsDto } from './dto/default_actions.dto';

@Injectable()
export class ActionsService {
  private defaultActions: Array<{
    service: string;
    actions: Array<ActionsDto>;
  }> = [
    {
      service: "discord",
      actions: [
        {
          name: "mention_recieved",
          description: "A mention is received on a Discord server.",
          argumentsNumber: 0,
          argumentsExample: [],
        },
      ],
    },
    {
      service: "google",
      actions: [
        {
          name: "new_email",
          description: "A new email is received in your Gmail account.",
          argumentsNumber: 1,
          argumentsExample: [{
            argumentName: "email",
            argumentDescription: "Email to seek."
          }],
        },
      ],
    },
  ];

  getDefaultActions() {
    return this.defaultActions;
  }
}

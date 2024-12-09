import { Injectable } from '@nestjs/common';
import { ActionsDto } from './dto/default_actions.dto';
import { GithubActionsService } from './github/github.actions.service';

@Injectable()
export class ActionsService {
  constructor(
    private readonly githubActionService : GithubActionsService
  ) {}
  private defaultActions: Array<{
    service: string;
    actions: Array<ActionsDto>;
  }> = [
    {
      service: "github",
      actions: [
        {
          name: "pr_assigned",
          description: "Triggered when a pull request is assigned to the user.",
          argumentsNumber: 1,
          argumentsExample: [
            {
              name: "Repository Link",
              description: "URL of the github repository with enough rights to create webhooks",
              example: "https://github.com/owner/repository",
              required: true
            },
          ],
        },
      ],
    }
  ];

  private actionServiceRegistry: Record<string, Function> = {
    pr_assigned : this.githubActionService.init_assign.bind(this.githubActionService)
  }

  getDefaultActions() {
    return this.defaultActions;
  }

  async executeAction(name: string, params: {}) {
    const actionFunction = this.actionServiceRegistry[name];

    if (!actionFunction) {
        throw new Error(`Reaction "${name}" not found.`);
    }
    return actionFunction(params);
  }
}

import { Injectable } from '@nestjs/common';
import { ActionsDto } from 'src/automation/dto/automation.dto';
import { GithubActionsService } from 'src/automation/services/github.action.service';

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
          argumentsNumber: 2,
          argumentsExample: [
            {
                name: "githubRepoUrl",
                description: "URL of the github repository with enough rights to create webhooks",
                example: "https://github.com/owner/repository",
                type: "string",
                required: true
            },
          ],
        },
      ],
    }
  ];

  private actionServiceRegistry: Record<string, Function> = {
    pr_assigned : this.githubActionService.initPullRequestWebhook.bind(this.githubActionService)
  }

  private destroyServiceRegistry: Record<string, Function> = {
    pr_assigned : this.githubActionService.destroyPullRequestWebhook.bind(this.githubActionService)
  }


  getDefaultActions() {
    return this.defaultActions;
  }

  async executeAction(userId: string, name: string, params: {}) {
    const actionFunction = this.actionServiceRegistry[name];

    if (!actionFunction)
        throw new Error(`Reaction "${name}" not found.`);

    return actionFunction(userId, params);
  }

  async destroyAction(userId: string, name: string, params: {}) {
    const destroyFunction = this.destroyServiceRegistry[name];

    if (!destroyFunction)
        throw new Error(`Reaction "${name}" not found.`);

    return destroyFunction(userId, params);
  }
}

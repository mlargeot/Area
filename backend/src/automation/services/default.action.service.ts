import { Injectable, NotFoundException } from '@nestjs/common';
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
      service: "Github",
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

  getServiceActions(service: string) {
    const serviceReactions = this.defaultActions.find(
      (entry) => entry.service === service
    );

    if (serviceReactions)
      return serviceReactions.actions;
    else
      throw new NotFoundException("Requested service not found.");
  }

  async executeAction(userId: string, name: string, params: {}) {
    const actionFunction = this.actionServiceRegistry[name];

    if (!actionFunction)
        throw new Error(`Reaction "${name}" not found.`);

    return actionFunction(userId, params);
  }

  async destroyAction(userId: string, name: string, metadata: {}) {
    const destroyFunction = this.destroyServiceRegistry[name];

    if (!destroyFunction)
        throw new Error(`Reaction "${name}" not found.`);

    return destroyFunction(userId, metadata);
  }
}

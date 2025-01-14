import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionsDto } from 'src/automation/dto/automation.dto';
import { GithubActionsService } from 'src/automation/services/github.action.service';
import { SpotifyAcitonsService } from 'src/automation/services/spotify.action.service';

@Injectable()
export class ActionsService {
  constructor(
        private readonly githubActionService : GithubActionsService,
        private readonly spotifyActionService : SpotifyAcitonsService
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
          argumentsNumber: 1,
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
        {
          name: "pr_reopened",
          description: "Triggered when a pull request is reopened in the targeted repository.",
          argumentsNumber: 1,
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
        {
          name: "pr_closed",
          description: "Triggered when a pull request is closed in the targeted repository.",
          argumentsNumber: 1,
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
        {
          name: "pr_opened",
          description: "Triggered when a pull request is opened in the targeted repository.",
          argumentsNumber: 1,
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
        {
          name: "security_alert",
          description: "Triggered when a security alert appears by a dependabot alert in the targeted repository.",
          argumentsNumber: 1,
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
        {
          name: "security_fix",
          description: "Triggered when a security fix appears by a dependabot alert in the targeted repository.",
          argumentsNumber: 1,
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
        {
          name: "push",
          description: "Triggered when a push is made on a repository.",
          argumentsNumber: 1,
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
        {
          name: "issue_opened",
          description: "Triggered when an issue is opened on a requested repository.",
          argumentsNumber: 1,
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
        {
          name: "issue_closed",
          description: "Triggered when an issue is closed on a requested repository.",
          argumentsNumber: 1,
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
        {
          name: "issue_reopened",
          description: "Triggered when an issue is reopened on a requested repository.",
          argumentsNumber: 1,
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
        {
          name: "issue_deleted",
          description: "Triggered when an issue is deleted on a requested repository.",
          argumentsNumber: 1,
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
    },
    {
      service: "Spotify",
      actions: [
        {
          name: "playlist_activity",
          description: "Triggered when activity appears in a playlist.",
          argumentsNumber: 1,
          argumentsExample:[
            {
              name: "playlistUrl",
              description: "Url of the playlist to check.",
              example: "https://open.spotify.com/playlist/2Frip4bF8igNgrnuRjqKGm",
              type: "string",
              required: true,
            }
          ]
        }
      ]
    }
  ];

  private actionServiceRegistry: Record<string, Function> = {
    pr_assigned : this.githubActionService.initPullRequestWebhook.bind(this.githubActionService),
    pr_opened: this.githubActionService.initPullRequestWebhook.bind(this.githubActionService),
    pr_reopened: this.githubActionService.initPullRequestWebhook.bind(this.githubActionService),
    pr_closed: this.githubActionService.initPullRequestWebhook.bind(this.githubActionService),
    security_alert : this.githubActionService.initDependabotWebhook.bind(this.githubActionService),
    security_fix : this.githubActionService.initDependabotWebhook.bind(this.githubActionService),
    push: this.githubActionService.initPushWebhook.bind(this.githubActionService),
    issue_opened: this.githubActionService.initIssuesWebhook.bind(this.githubActionService),
    issue_closed: this.githubActionService.initIssuesWebhook.bind(this.githubActionService),
    issue_deleted: this.githubActionService.initIssuesWebhook.bind(this.githubActionService),
    issue_reopened: this.githubActionService.initIssuesWebhook.bind(this.githubActionService),
    playlist_activity : this.spotifyActionService.initActivityPlaylistCheck.bind(this.spotifyActionService),
  }

  private destroyServiceRegistry: Record<string, Function> = {
    pr_assigned : this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    pr_opened: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    pr_reopened: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    pr_closed: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    security_alert: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    security_fix: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    push: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    issue_opened: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    issue_closed: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    issue_deleted: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
    issue_reopened: this.githubActionService.destroyGithubWebhook.bind(this.githubActionService),
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
    if (name in this.destroyServiceRegistry) {
      const destroyFunction = this.destroyServiceRegistry[name];

      if (!destroyFunction)
          throw new Error(`Reaction "${name}" not found.`);

      return destroyFunction(userId, metadata);
    }
    return true;
  }
}

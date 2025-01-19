import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionsDto } from 'src/automation/dto/automation.dto';
import { GithubActionsService } from 'src/automation/services/github.action.service';
import { SpotifyAcitonsService } from 'src/automation/services/spotify.action.service';
import { LeagueofLegendsActionsService } from './leagueoflegends.action.service';
import { TwitchActionsService } from 'src/automation/services/twitch.action.service';
import { StravaActionsService } from 'src/automation/services/strava.action.service';
import { OutlookActionsService } from './outlook.action.service';
import { LogService } from 'src/log/log.service';
import { OutlookEmailsActionsService } from './outlook-emails.action.service';
import { OutlookEventsActionsService } from './outlook-events.action.service';

@Injectable()
export class ActionsService {
  constructor(
        private readonly githubActionService : GithubActionsService,
        private readonly spotifyActionService : SpotifyAcitonsService,
        private readonly leagueofLegendsActionService : LeagueofLegendsActionsService,
        private readonly twitchActionService : TwitchActionsService,
        private readonly outlookActionService : OutlookActionsService,
        private readonly outlookEmailsActionService : OutlookEmailsActionsService,
        private readonly outlookEventsActionService : OutlookEventsActionsService,
        private readonly stravaActionService : StravaActionsService,
        private logService: LogService
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
        }
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
    },
    {
      service: "League of Legends",
      actions: [
        {
          name: "lol_match_history",
          description: "Triggered when a new match appears in the user's match history. EUW region only.",
          argumentsNumber: 2,
          argumentsExample: [
            {
              name: "playerName",
              description: "Name of the user to check.",
              example: "SummonerName",
              type: "string",
              required: true,
            },
            {
              name: "tagLine",
              description: "Tagline of the user to check.",
              example: "1234",
              type: "string",
              required: true,
            }
          ],
        },
        {
          name: "lol_users_activity",
          description: "Triggered when a user from a list plays a game in the EUW region.",
          argumentsNumber: 2,
          argumentsExample: [
            {
              name: "playerlist",
              description: "list of users to check.",
              example: "Diabolo#1234, Diabolo#1234",
              type: "string",
              required: true,
            }
          ],
        }
      ]
    },
    {
      service: "Twitch",
      actions: [
        {
          name: "live_start",
          description: "Triggered when live of specified streamer start.",
          argumentsNumber: 1,
          argumentsExample: [
            {
              name: "broadcaster",
              description: "Login username of the streamer",
              example: "lekiweak",
              type: "string",
              required: true
            }
          ]
        }
      ]
    },
    {
      service: "Outlook, Microsoft",
      actions: [
        {
          name: "new_task_in_list",
          description: "Triggered when a new task is added to a specified list.",
          argumentsNumber: 1,
          argumentsExample: [
            {
              name: "listName",
              description: "Name of the list to check.",
              example: "To Do",
              type: "string",
              required: true
            }
          ]
        },
        {
          name: "new_email",
          description: "Triggered when a new email is received.",
          argumentsNumber: 0,
          argumentsExample: []
        },
        {
          name: "new_calendar_event",
          description: "Triggered when a new calendar event is added.",
          argumentsNumber: 0,
          argumentsExample: []
        }
      ]
    },
    {
      service: "Youtube",
      actions: [
        {
          name: "new_video",
          description: "Triggered when a new video is uploaded to the channel.",
          argumentsNumber: 1,
          argumentsExample: [
            {
              name: "channelId",
              description: "Id of the channel to check.",
              example: "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
              type: "string",
              required: true
            }
          ]
        }
      ]

    },
    {
      service: "Strava",
      actions: [
        { 
          name: 'new_activity',
          description: "Triggered when a new activity is post on Strava.",
          argumentsNumber: 0,
          argumentsExample: []
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
    lol_match_history : this.leagueofLegendsActionService.initLeagueofLegendsAction.bind(this.leagueofLegendsActionService),
    lol_users_activity : this.leagueofLegendsActionService.initLeagueofLegendsStatusAction.bind(this.leagueofLegendsActionService),
    live_start: this.twitchActionService.initStreamOnlineEvent.bind(this.twitchActionService),
    new_task_in_list: this.outlookActionService.initOutlookTaskAction.bind(this.outlookActionService),
    new_email: this.outlookEmailsActionService.initEmailCheck.bind(this.outlookEmailsActionService),
    new_calendar_event: this.outlookEventsActionService.initCalendarCheck.bind(this.outlookEventsActionService),
    new_activity: this.stravaActionService.initNewActivityEvent.bind(this.stravaActionService), 
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
    live_start: this.twitchActionService.destroyTwitchWebhook.bind(this.twitchActionService),
    new_activity: this.stravaActionService.destroyStravaWebhook.bind(this.stravaActionService),
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

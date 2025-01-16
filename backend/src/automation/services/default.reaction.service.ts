import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactionsDto } from 'src/automation/dto/automation.dto';
import { ReactionsDiscordService } from 'src/automation/services/discord.reaction.service';
import { ReactionsGoogleService } from 'src/automation/services/google.reaction.service';
import { ReactionsGithubService } from 'src/automation/services/github.reaction.service';

@Injectable()
export class ReactionsService {
  constructor (
    private readonly discordServices : ReactionsDiscordService,
    private readonly googleService : ReactionsGoogleService,
    private readonly githubService : ReactionsGithubService
  ) {}

  private defaultReactions: Array<{
    service: string;
    reactions: Array<ReactionsDto>;
  }> = [
    {
      service: "Discord",
      reactions: [
        {
          name: "send_webhook_message",
          description: "Send message to the targeted discord webhook.",
          argumentsNumber: 2,
          argumentsExample: [
            {
              name: "url",
              description: "URL of the discord webhook to send message to.",
              example: "https://discord/webhook/dzkadlzakjdlzakjdlzakjdlzakjd",
              type: "string",
              required: true
            },
            {
              name: "message_content",
              description: "Content of the message to send.",
              example: "A new Issue as been assigned.",
              type: "text",
              required: true
            }
          ],
        },
      ],
    },
    {
      service: "Google",
      reactions: [
        {
          name: "send_mail",
          description: "Send mail to the user connected with google service.",
          argumentsNumber: 2,
          argumentsExample: [
            {
              name: "mail_object",
              description: "Object of the mail to send.",
              example: "[Youtube notification]",
              type: "string",
              required: true
            },
            {
              name: "mail_message",
              description: "Content of the message to send.",
              example: "Video from AR3M has been posted !",
              type: "text",
              required: true
            }
          ],
        },
      ],
    },
    {
      service: "Github",
      reactions: [
        {
          name: "comment_issue",
          description: "Automatically comment on the specified issue when the action is triggered.",
          argumentsNumber: 2,
          argumentsExample: [
            {
              name: "issue_url",
              description: "Url of the issue to comment.",
              example: "https://github.com/owner/repository/issues/number",
              type: "string",
              required: true
            },
            {
              name: "comment",
              description: "Comment to send to issue.",
              example: "I'm not here for the week, please contact me later!",
              type: "text",
              required: true
            }
          ],
        },
        {
          name: "create_issue",
          description: "Automatically create an issue on the specified repository when the action is triggered.",
          argumentsNumber: 2,
          argumentsExample: [
            {
              name: "repository_url",
              description: "Url of the repository where create the issue.",
              example: "https://github.com/owner/repository/issues/number",
              type: "string",
              required: true
            },
            {
              name: "title",
              description: "Title of the issue issue.",
              example: "NEW REALEASE",
              type: "string",
              required: true
            },
            {
              name: "body",
              description: "Body of the issue.",
              example: "This repository has a new realse, you should check it out",
              type: "text",
              required: true
            }
          ],
        },
      ],
    }
  ];

  private reactionServiceRegistry: Record<string, Function> = {
    send_webhook_message : this.discordServices.sendMessageToWebhook.bind(this.discordServices),
    send_mail : this.googleService.sendMail.bind(this.googleService),
    comment_issue: this.githubService.sendCommentToIssue.bind(this.githubService),
    create_issue: this.githubService.createIssue.bind(this.githubService)
  }


  getDefaultReactions() {
    return this.defaultReactions;
  }

  getServiceReactions(service: string) {
    const serviceReactions = this.defaultReactions.find(
      (entry) => entry.service === service
    );

    if (serviceReactions)
      return serviceReactions.reactions;
    else
      throw new NotFoundException("Requested service not found.");
  }

  async executeReaction(userId: string, name: string, params: {}, actionData: any = {}) {
    const reactionFunction = this.reactionServiceRegistry[name];

    if (!reactionFunction) {
        throw new Error(`Reaction "${name}" not found.`);
    }
    return reactionFunction(userId, params, actionData);
  }
}

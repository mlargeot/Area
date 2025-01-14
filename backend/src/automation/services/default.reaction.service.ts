import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactionsDto } from 'src/automation/dto/automation.dto';
import { ReactionsDiscordService } from 'src/automation/services/discord.reaction.service';
import { ReactionsGoogleService } from './google.reaction.service';

@Injectable()
export class ReactionsService {
  constructor (
    private readonly discordServices : ReactionsDiscordService,
    private readonly googleService : ReactionsGoogleService
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
    }
  ];

  private reactionServiceRegistry: Record<string, Function> = {
    send_webhook_message : this.discordServices.sendMessageToWebhook.bind(this.discordServices),
    send_mail : this.googleService.sendMail.bind(this.googleService)
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
  

  async executeReaction(userId: string, name: string, params: {}) {
    const reactionFunction = this.reactionServiceRegistry[name];

    if (!reactionFunction) {
        throw new Error(`Reaction "${name}" not found.`);
    }
    return reactionFunction(userId, params);
  }
}

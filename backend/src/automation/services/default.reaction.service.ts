import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactionsDto } from 'src/automation/dto/automation.dto';
import { ReactionsDiscordService } from 'src/automation/services/discord.reaction.service';

@Injectable()
export class ReactionsService {
  constructor (
    private readonly discordServices : ReactionsDiscordService
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
              name: "webhook_url",
              description: "URL of the discord webhook to send message to.",
              example: "https://discord/webhook/dzkadlzakjdlzakjdlzakjdlzakjd",
              type: "string",
              required: true
            },
            {
              name: "message_content",
              description: "Content of the message to send.",
              example: "A new Issue as been assigned.",
              type: "string",
              required: true
            }
          ],
        },
      ],
    }
  ];

  private reactionServiceRegistry: Record<string, Function> = {
    send_webhook_message : this.discordServices.sendMessageToWebhook.bind(this.discordServices)
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
  

  async executeReaction(name: string, params: {}) {
    const reactionFunction = this.reactionServiceRegistry[name];

    if (!reactionFunction) {
        throw new Error(`Reaction "${name}" not found.`);
    }
    return reactionFunction(params);
  }
}

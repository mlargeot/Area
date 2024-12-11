import { Injectable } from '@nestjs/common';
import { ReactionsDto } from './dto/default_reactions.dto';
import { ReactionsDiscordService } from './discord/r_discord.service';

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
      service: "discord",
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
              required: true
            },
            {
              name: "message_content",
              description: "Content of the message to send.",
              example: "A new Issue as been assigned.",
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

  async executeReaction(name: string, params: {}) {
    const reactionFunction = this.reactionServiceRegistry[name];

    if (!reactionFunction) {
        throw new Error(`Reaction "${name}" not found.`);
    }
    return reactionFunction(params);
  }
}

import { Injectable } from '@nestjs/common';
import { ReactionsDto } from './dto/default_reactions.dto';

@Injectable()
export class ReactionsService {
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
              example: "https://discord/webhook/dzkadlzakjdlzakjdlzakjdlzakjd"
            },
            {
              name: "message_content",
              description: "Content of the message to send.",
              example: "A new Issue as been assigned."
            }
          ],
        },
      ],
    }
  ];

  getDefaultReactions() {
    return this.defaultReactions;
  }
}

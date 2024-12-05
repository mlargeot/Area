import { ApiProperty } from '@nestjs/swagger';

export class ReactionsDto {
  @ApiProperty({ example: 'send_webhook_message', description: 'The name of the reaction.' })
  name: string;

  @ApiProperty({ example: 'A message is sent on a Discord webhook.', description: 'The description of the reaction.' })
  description: string;

  @ApiProperty({ example: 1, description: 'The number of arguments required for this reaction.' })
  argumentsNumber: number;

  @ApiProperty({ example: [
    {
        name: "webhook_url",
        description: "URL of the webhook to send the message to.",
        example: "https://discord/webhook/dnazldnzladknzkldn"
    }
  ], description: 'Examples of arguments for the targeted reaction.' })
  argumentsExample: any[];
}

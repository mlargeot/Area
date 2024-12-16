import { ApiProperty } from '@nestjs/swagger';

export class ReactionArgumentDto {
  @ApiProperty({ example: 'webhook_url', description: 'The name of the argument.' })
  name: string;

  @ApiProperty({ example: 'URL of the webhook to send the message to.', description: 'The description of the argument.' })
  description: string;

  @ApiProperty({ example: 'https://discord/webhook/dnazldnzladknzkldn', description: 'An example value for this argument.' })
  example: string;

  @ApiProperty({ example: 'string', description: 'Type of the value.' })
  type: string;

  @ApiProperty({ example: true, description: 'Indicates if this argument is required.' })
  required: boolean;
}

export class ReactionsDto {
  @ApiProperty({ example: 'send_webhook_message', description: 'The name of the reaction.' })
  name: string;

  @ApiProperty({ example: 'A message is sent on a Discord webhook.', description: 'The description of the reaction.' })
  description: string;

  @ApiProperty({ example: 1, description: 'The number of arguments required for this reaction.' })
  argumentsNumber: number;

  @ApiProperty({
    type: [ReactionArgumentDto],
    description: 'Examples and details of the arguments required for the reaction.',
  })
  argumentsExample: ReactionArgumentDto[];
}

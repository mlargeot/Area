import { ApiProperty } from '@nestjs/swagger';

export class ActionsArgumentDto {
  @ApiProperty({ example: 'webhook_url', description: 'The name of the argument.' })
  name: string;

  @ApiProperty({ example: 'URL of the webhook to send the message to.', description: 'The description of the argument.' })
  description: string;

  @ApiProperty({ example: 'https://discord/webhook/dnazldnzladknzkldn', description: 'An example value for this argument.' })
  example: string;

  @ApiProperty({ example: true, description: 'Indicates if this argument is required.' })
  required: boolean;
}

export class ActionsDto {
  @ApiProperty({ example: 'mention_recieved', description: 'The name of the action.' })
  name: string;

  @ApiProperty({ example: 'A mention is received on a Discord server.', description: 'The description of the action.' })
  description: string;

  @ApiProperty({ example: 1, description: 'The number of arguments required for this action.' })
  argumentsNumber: number;

  @ApiProperty({
    type: [ActionsArgumentDto],
    description: 'Examples and details of the arguments required for the reaction.',
  })
  argumentsExample: ActionsArgumentDto[];
}

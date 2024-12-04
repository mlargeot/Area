import { ApiProperty } from '@nestjs/swagger';

export class ActionsDto {
  @ApiProperty({ example: 'mention_recieved', description: 'The name of the action.' })
  name: string;

  @ApiProperty({ example: 'A mention is received on a Discord server.', description: 'The description of the action.' })
  description: string;

  @ApiProperty({ example: 1, description: 'The number of arguments required for this action.' })
  argumentsNumber: number;

  @ApiProperty({ example: [
    {
        name: "email",
        description: "Email to seek.",
        example: "example@gmail.com"
    }
  ], description: 'Examples of arguments for the targeted action.' })
  argumentsExample: any[];
}

import { ApiProperty } from '@nestjs/swagger';

export class ActionsDto {
  @ApiProperty({
    description: "The name of the action.",
    example: "new_message_in_group"
  })
  name: string;

  @ApiProperty({
    description: 'The description of the action',
    example: 'A new message is posted in the group',
  })
  description: string;


  @ApiProperty({
    description: "Requiered number of arguments for the action",
    example: 1,
  })
  argumentsNumber: number;

  @ApiProperty({
    description: "Arguments examples if arguments are required",
    example: [{
        argumentName: "group",
        argumentDescription: "Group to seek if a message is sent."
    }]
  })
  argumentsExample: Array<{
    argumentName: string,
    argumentDescription: string
  }>
}

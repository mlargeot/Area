import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "The email of the user.",
    example: "user@example.com"
  })
  email: string;

  @ApiProperty({
    description: 'The password for the user',
    example: 'password123',
  })
  password: string;
}

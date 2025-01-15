import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The new password of the user',
    example: 'password',
  })
  password: string;
  @ApiProperty({
    description: 'The reset token sended to the user email',
    example: 'reset-token',
  })
  token: string;
}

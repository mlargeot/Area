import { ApiProperty } from '@nestjs/swagger';

export class ProviderDto {
  @ApiProperty({
    description: 'The provider of the user',
    example: 'google',
  })
  provider: string;
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email?: string;
  @ApiProperty({
    description: 'The access token of the user',
    example: 'access-token',
  })
  accessToken: string;
  @ApiProperty({
    description: 'The refresh token of the user',
    example: 'refresh-token',
  })
  refreshToken: string;
  @ApiProperty({
    description: 'The account ID of the user',
    example: 'account-id',
  })
  accountId: string;
}

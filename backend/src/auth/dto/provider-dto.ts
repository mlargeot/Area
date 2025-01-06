import { ApiProperty } from '@nestjs/swagger';

export class ProviderDto {
  provider: string;
  // optional
  email?: string;
  accessToken: string;
  refreshToken: string;
  accountId: string;
}

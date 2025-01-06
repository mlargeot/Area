import { ApiProperty } from '@nestjs/swagger';

export class ProviderDto {
  provider: string;
  // optional
  email?: string;
  token: string;
  refreshToken: string;
  accountId: string;
}

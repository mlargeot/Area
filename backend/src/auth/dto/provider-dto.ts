import { ApiProperty } from '@nestjs/swagger';

export class ProviderDto {
  provider: string;
  email: string;
  token: string;
  refreshToken: string;
  accountId: string;
}

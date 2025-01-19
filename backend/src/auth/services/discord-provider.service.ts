import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProviderService, ProviderConfig } from './interfaces/provider.interface';
import { ProviderDto } from '../dto/provider-dto';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class DiscordService implements ProviderService {
  config: ProviderConfig = {
    clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
      scopes: ['identify', 'email'],
  };

  async refreshToken(): Promise<void> {
    console.log('Refreshing token for Discord');
  }
  async exchangeCode(code: string): Promise<ProviderDto> {
    console.log('Exchanging code for Discord');
    try {
      const { data } = await axios.post(
        'https://discord.com/api/oauth2/token',
        qs.stringify({
          code,
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          redirect_uri: `${process.env.API_URL}/auth/callback`,
          grant_type: 'authorization_code',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      const discordUser = await axios.get(
        'https://discord.com/api/v9/users/@me',
        {
          headers: { Authorization: `Bearer ${data.access_token}` },
        },
      );

      return {
        provider: 'discord',
        email: discordUser.data.email,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accountId: discordUser.data.id,
      };
    } catch (error) {
      throw new HttpException(
        'Token exchange failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
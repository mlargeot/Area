import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProviderService, ProviderConfig } from './interfaces/provider.interface';
import { ProviderDto } from '../dto/provider-dto';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class TwitchService implements ProviderService {
  config: ProviderConfig = {
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    authorizationEndpoint: 'https://id.twitch.tv/oauth2/authorize',
    scopes: ['user:read:email'],
  };

  async refreshToken(): Promise<void> {
    console.log('Refreshing token for Twitch');
  }
  async exchangeCode(code: string): Promise<ProviderDto> {
    console.log('Exchanging code for Twitch');
    try {
      const { data } = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        qs.stringify({
          code,
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          redirect_uri: process.env.API_URL + '/auth/callback',
          grant_type: 'authorization_code',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      console.log(data);
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const twitchUser = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(twitchUser.data);

      return {
        provider: 'twitch',
        email: twitchUser.data.data[0].email,
        accessToken: accessToken,
        refreshToken,
        accountId: twitchUser.data.data[0].id,
      };
    } catch (error) {
      console.error(
        'Token exchange failed:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Token exchange failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
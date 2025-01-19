import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProviderService, ProviderConfig } from './interfaces/provider.interface';
import { ProviderDto } from '../dto/provider-dto';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class FacebookService implements ProviderService {
  config: ProviderConfig = {
    clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorizationEndpoint: 'https://www.facebook.com/v11.0/dialog/oauth',
      scopes: ['email'],
  };

  async refreshToken(): Promise<void> {
    console.log('Refreshing token for Facebook');
  }
  async exchangeCode(code: string): Promise<ProviderDto> {
    console.log('Exchanging code for Facebook');
    try {
      const { data } = await axios.get(
        'https://graph.facebook.com/v11.0/oauth/access_token',
        {
          params: {
            code,
            client_id: process.env.FACEBOOK_CLIENT_ID,
            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
            redirect_uri: `${process.env.API_URL}/auth/callback`,
          },
        },
      );
      const facebookUser = await axios.get(
        'https://graph.facebook.com/v11.0/me',
        {
          params: {
            fields: 'email',
            access_token: data.access_token,
          },
        },
      );

      return {
        provider: 'facebook',
        email: facebookUser.data.email,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accountId: facebookUser.data.id,
      };
    } catch (error) {
      throw new HttpException(
        'Token exchange failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
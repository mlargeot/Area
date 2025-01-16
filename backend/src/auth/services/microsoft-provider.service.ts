import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProviderService, ProviderConfig } from './interfaces/provider.interface';
import { ProviderDto } from '../dto/provider-dto';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class MicrosoftService implements ProviderService {
  config: ProviderConfig = {
    clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      authorizationEndpoint:
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      scopes: ['user.read'],
  };

  async refreshToken(): Promise<void> {
    console.log('Refreshing token for Microsoft');
  }
  async exchangeCode(code: string): Promise<ProviderDto> {
    console.log('Exchanging code for Microsoft');
    try {
      const { data } = await axios.post(
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        qs.stringify({
          code,
          client_id: process.env.MICROSOFT_CLIENT_ID,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET,
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
      const microsoftUser = await axios.get(
        'https://graph.microsoft.com/v1.0/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(microsoftUser.data);

      return {
        provider: 'microsoft',
        email: microsoftUser.data.userPrincipalName,
        accessToken: accessToken,
        refreshToken,
        accountId: microsoftUser.data.id,
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
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProviderService, ProviderConfig } from './interfaces/provider.interface';
import { ProviderDto } from '../dto/provider-dto';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class StravaService implements ProviderService {
  config: ProviderConfig = {
    clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      authorizationEndpoint: 'https://www.strava.com/oauth/authorize',
      scopes: ['profile:read_all'],
  };

  async refreshToken(): Promise<void> {
    console.log('Refreshing token for Discord');
  }
  async exchangeCode(code: string): Promise<ProviderDto> {
    console.log('Exchanging code for Discord');
    
    try {
      const { data } = await axios.post(
        'https://www.strava.com/oauth/token',
        qs.stringify({
          code,
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          redirect_uri: `${process.env.API_URL}/auth/callback`,
          grant_type: 'authorization_code',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      const stravaUser = await axios.get(
        'https://www.strava.com/api/v3/athlete',
        {
          headers: { Authorization: `Bearer ${data.access_token}` },
        },
      );

      return {
        provider: 'strava',
        email: stravaUser.data.email,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accountId: stravaUser.data.id,
      };
    } catch (error) {
      throw new HttpException(
        'Token exchange failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    
  }
}
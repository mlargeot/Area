import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProviderService, ProviderConfig } from './interfaces/provider.interface';
import { ProviderDto } from '../dto/provider-dto';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class SpotifyService implements ProviderService {
  config: ProviderConfig = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    scopes: [
      'user-read-private user-read-email playlist-read-private playlist-read-collaborative',
    ],
  };

  async refreshToken(): Promise<void> {
    console.log('Refreshing token for Spotify');
  }
  async exchangeCode(code: string): Promise<ProviderDto> {
    console.log('Exchanging code for Spotify');
    try {
      const { data } = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
          code,
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET,
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
      const spotifyUser = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(spotifyUser.data);

      return {
        provider: 'spotify',
        email: spotifyUser.data.email,
        accessToken: accessToken,
        refreshToken,
        accountId: spotifyUser.data.id,
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
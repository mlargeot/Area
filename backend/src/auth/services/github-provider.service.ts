import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProviderService, ProviderConfig } from './interfaces/provider.interface';
import { ProviderDto } from '../dto/provider-dto';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class GithubService implements ProviderService {
  config: ProviderConfig = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    scopes: ['user:email', 'repo', 'admin:webhook', 'admin:repo_hook'],
  };

  async refreshToken(): Promise<void> {
    console.log('Refreshing token for Github');
  }
  async exchangeCode(code: string): Promise<ProviderDto> {
    console.log('Exchanging code for Github');
    try {
      const { data } = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          code,
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          redirect_uri: process.env.API_URL + '/auth/callback',
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      console.log(data);

      const accessToken = data.access_token;
      const githubUser = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(githubUser.data);

      return {
        provider: 'github',
        email: githubUser.data.email ? githubUser.data.email : 'null',
        accessToken: accessToken,
        refreshToken: null, // GitHub tokens don't have a refresh token
        accountId: githubUser.data.id,
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
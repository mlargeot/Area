import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProviderService, ProviderConfig } from './interfaces/provider.interface';
import { ProviderDto } from '../dto/provider-dto';
import { Model } from 'mongoose';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';

import * as qs from 'qs';
import { User, UserDocument } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleService implements ProviderService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  config: ProviderConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      scopes: [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.send',
      ],
  };

  async refreshToken(): Promise<void> {
    console.log('Refreshing token for Google');
  }
  async exchangeCode(code: string): Promise<ProviderDto> {
    console.log('Exchanging code for Google');
    try {
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.API_URL}/auth/callback`,
        grant_type: 'authorization_code',
      });
      const idToken = data.id_token;
      const decoded = this.jwtService.decode(idToken) as any;

      return {
        provider: 'google',
        email: decoded.email,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accountId: decoded.sub,
      };
    } catch (error) {
      throw new HttpException(
        'Token exchange failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
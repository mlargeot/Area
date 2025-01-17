import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as qs from 'qs';
import { ProviderDto } from '../dto/provider-dto';
import { ProviderService } from './interfaces/provider.interface';
import { GoogleService } from './google-provider.service';
import { DiscordService } from './discord-provider.service';
import { GithubService } from './github-provider.service';
import { TwitchService } from './twitch-provider.service';
import { SpotifyService } from './spotify-provider.service';
import { MicrosoftService } from './microsoft-provider.service';
import { StravaService } from './strava-provider.service';
import { FacebookService } from './facebook-provider.service';

const services = [
  { name: 'Discord', color: '#5865F2', isActive: false, email: '', icon: 'https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png' },
  { name: 'Spotify', color: '#1DB954', isActive: false, email: '', icon: 'https://docs.expo.dev/static/images/sdk/auth-session/spotify.png' },
  { name: 'Twitch', color: '#9146FF', isActive: false, email: '', icon: 'https://docs.expo.dev/static/images/sdk/auth-session/twitch.png' },
  { name: 'Google', color: '#FF0000', isActive: false, email: '', icon: 'https://docs.expo.dev/static/images/sdk/auth-session/google.png' },
  { name: 'Github', color: '#333333', isActive: false, email: '', icon: 'https://docs.expo.dev/static/images/sdk/auth-session/github.png' },
  { name: 'Microsoft', color: '#00A4EF', isActive: false, email: '', icon: 'https://cdn-icons-png.flaticon.com/512/732/732221.png' },
  { name: 'Strava', color: '#FC4C02', isActive: false, email: '', icon: 'https://docs.expo.dev/static/images/sdk/auth-session/strava.png' },
  { name: 'Facebook', color: '#1877F2', isActive: false, email: '', icon: 'https://docs.expo.dev/static/images/sdk/auth-session/facebook.png' },
];

@Injectable()
export class ProvidersService {
  public providerList: any;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    public googleService: GoogleService,
    public discordService: DiscordService,
    public githubService: GithubService,
    public twitchService: TwitchService,
    public spotifyService: SpotifyService,
    public microsoftService: MicrosoftService,
    public stravaService: StravaService,
    public facebookService: FacebookService,
  ) {
    this.providerList = {
      google: googleService,
      discord: discordService,
      github: githubService,
      twitch: twitchService,
      spotify: spotifyService,
      microsoft: microsoftService,
      strava: stravaService,
      facebook: facebookService,
    }
  };

  /**
    * Redirects the user to the provider's login page
    * @param service - provider name
    * @param state - CSRF token
    * @returns URL to redirect the user to
    */
  loginProvider(service: string, state: any): string {
    const provider = this.providerList[service];
    if (!provider) {
      throw new HttpException('Invalid service', HttpStatus.BAD_REQUEST);
    }

    const redirectUri = process.env.API_URL + '/auth/callback';
    const authorizationUrl = `${provider.config.authorizationEndpoint}?client_id=${provider.config.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${provider.config.scopes.join(
      ' ',
    )}&state=${state}`;

    return authorizationUrl;
  }

  /**
    * Handles the callback from the provider
    * @param provider - provider name
    * @param code - authorization code
    * @returns access
    */
  async loginProviderCallback(provider: string, code: string): Promise<string> {
    let providerDto;

    switch (provider) {
      case 'google':
        providerDto = await this.providerList.google.exchangeCode(code);
        break;
      case 'discord':
        providerDto = await this.providerList.discord.exchangeCode(code);
        break;
      default:
        throw new HttpException('Invalid provider', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findOne({
      email: providerDto.email,
      connectionMethod: providerDto.provider,
    });

    if (!user) {
      const newUser = await this.userModel.create({
        email: providerDto.email,
        password: null,
        connectionMethod: providerDto.provider,
        oauthProviders: [providerDto],
      });
      const payload = { email: newUser.email, sub: newUser._id };
      return this.jwtService.sign(payload);
    } else {
      const payload = { email: user.email, sub: user._id };
      return this.jwtService.sign(payload);
    }
  }

  /**
    * Handles the callback from the provider
    * @param provider - provider name
    * @param code - authorization code
    * @param userId - user id
    */
  async connectProviderCallback(
    provider: string,
    code: string,
    userId: string,
  ) {
    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user)
      throw new HttpException('User not found, get out!', HttpStatus.NOT_FOUND);

    const exchangeTokenMethod = this.providerList[provider].exchangeCode;
    if (!exchangeTokenMethod) {
      throw new HttpException('Invalid provider', HttpStatus.BAD_REQUEST);
    }

    const providerService = this.providerList[provider];
    const providerDto = await providerService.exchangeCode(code);

    const providerIndex = user.oauthProviders.findIndex(
      (provider) => provider.provider === providerDto.provider,
    );
    if (providerIndex === -1) {
      console.log('new provider');
      user.oauthProviders.push(providerDto);
    } else {
      console.log('updating a provider');
      user.oauthProviders[providerIndex].accessToken = providerDto.token;
      user.oauthProviders[providerIndex].refreshToken =
        providerDto.refreshToken;
      user.oauthProviders[providerIndex].email = providerDto.email;
      user.oauthProviders[providerIndex].accountId = providerDto.accountId;
    }
    user.save();
  }

  /**
    * Disconnects a provider from the user
    * @param provider - provider name
    * @param user - user object
    */
  async disconnectProvider(provider: string, user: any) {
    const existingUser = await this.userModel.findOne({
      _id: user.userId,
    });
    if (!existingUser)
      throw new HttpException('User not found, get out!', HttpStatus.NOT_FOUND);
    if (provider === user.connectionMethod)
      throw new HttpException(
        'Cannot disconnect the primary connection method',
        HttpStatus.BAD_REQUEST,
      );
    const providerIndex = existingUser.oauthProviders.findIndex(
      (p) => p.provider === provider,
    );
    if (providerIndex !== -1) {
      existingUser.oauthProviders.splice(providerIndex, 1);
      existingUser.save();
    }
  }

  /**
    * Lists the services connected to the user
    * @param user - user object
    * @returns list of services
    */
  async listServices(user: any) {
    const { userId } = user;
    const existingUser = await this.userModel.findOne({
      _id: userId,
    });
    if (!existingUser)
      throw new HttpException('User not found, get out!', HttpStatus.NOT_FOUND);

    console.log('test', existingUser.oauthProviders);

    const servicesCopy = services.map((service) => {
      service.isActive = false;
      service.email = '';
      return service;
    });

    existingUser.oauthProviders.forEach((provider) => {
      const service = servicesCopy.find(
        (service) =>
          service.name.toLowerCase() === provider.provider.toLowerCase(),
      );
      if (service) {
        service.isActive = true;
        service.email = provider.email;
      }
    });

    return servicesCopy;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import * as qs from 'qs';
import { ProviderDto } from './dto/provider-dto';

// services format:
const services = [
  { name: 'Discord', color: '#5865F2', isActive: false, email: '' },
  { name: 'Spotify', color: '#1DB954', isActive: false, email: '' },
  { name: 'Twitch', color: '#9146FF', isActive: false, email: '' },
  { name: 'Google', color: '#FF0000', isActive: false, email: '' },
  { name: 'Github', color: '#333333', isActive: false, email: '' },
  { name: 'Microsoft', color: '#00A4EF', isActive: false, email: '' },
];

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user.
   * @param createUserDto - Data transfer object containing user registration details.
   * @returns The created user.
   * @throws HttpException if the user already exists.
   */
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    console.log(email + ' ' + password);
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      connectionMethod: 'local',
    });

    return user;
  }

  /**
   * Logs in a user.
   * @param loginUserDto - Data transfer object containing user login details.
   * @returns An object containing the access token.
   * @throws HttpException if the user is not found or the password is invalid.
   */
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, sub: user._id };
    console.log(email + ' logged in');
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Sends a password reset email.
   * @param forgotPasswordDto - Data transfer object containing the user's email address.
   * @returns An object containing a success message.
   * @throws HttpException if the user is not found or the email fails to send.
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({
      email,
      connectionMethod: 'local',
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const resetToken = this.jwtService.sign({
      email: user.email,
      _id: user._id,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'alexisdiabolo19@gmail.com',
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'alexisdiabolo19@gmail.com',
      to: email,
      subject: 'AR3M - Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password: \n\n ${resetUrl}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { message: 'Password reset email sent successfully!' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Resets a user's password.
   * @param resetPassword - Data transfer object containing the reset token and new password.
   * @returns An object containing a success message.
   * @throws HttpException if the user is not found.
   */
  async resetPassword(resetPassword: ResetPasswordDto) {
    const { token, password } = resetPassword;
    const decoded = this.jwtService.verify(token);

    const user = await this.userModel.findOne({
      email: decoded.email,
      connectionMethod: 'local',
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password reset successful!' };
  }

  async protectedResource(tmpUser: any) {
    const user = await this.userModel.findOne({ _id: tmpUser.userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const { email, _id } = user;
    return { email, _id };
  }

  providers = {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      scopes: ['openid', 'profile', 'email'],
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
      scopes: ['identify', 'email'],
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      scopes: ['user:email:repo'],
    },
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      authorizationEndpoint: 'https://id.twitch.tv/oauth2/authorize',
      scopes: ['user:read:email'],
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      scopes: ['user-read-private user-read-email'],
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      authorizationEndpoint:
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      scopes: ['user.read'],
    },
  };

  loginProvider(service: string, state: any): string {
    console.log('loginProvider');
    console.log(service);
    console.log(state);

    const provider = this.providers[service];
    if (!provider) {
      throw new HttpException('Invalid service', HttpStatus.BAD_REQUEST);
    }

    const redirectUri = process.env.API_URL + '/auth/callback';
    const authorizationUrl = `${provider.authorizationEndpoint}?client_id=${provider.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${provider.scopes.join(
      ' ',
    )}&state=${state}`;

    return authorizationUrl;
  }

  async loginProviderCallback(provider: string, code: string): Promise<string> {
    console.log('loginProviderCallback');

    let providerDto;
    switch (provider) {
      case 'google':
        providerDto = await this.exchangeTokenGoogle(code);
        break;
      case 'discord':
        providerDto = await this.exchangeTokenDiscord(code);
        break;
      case 'github':
        providerDto = await this.exchangeTokenGithub(code);
        break;
      case 'twitch':
        providerDto = await this.exchangeTokenTwitch(code);
        break;
      case 'spotify':
        providerDto = await this.exchangeTokenSpotify(code);
        break;
      case 'microsoft':
        providerDto = await this.exchangeTokenMicrosoft(code);
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

  async connectProviderCallback(
    provider: string,
    code: string,
    userId: string,
  ) {
    console.log('connectProviderCallback');

    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user)
      throw new HttpException('User not found, get out!', HttpStatus.NOT_FOUND);

    let providerDto;
    switch (provider) {
      case 'google':
        providerDto = await this.exchangeTokenGoogle(code);
        break;
      case 'discord':
        providerDto = await this.exchangeTokenDiscord(code);
        break;
      case 'github':
        providerDto = await this.exchangeTokenGithub(code);
        break;
      case 'twitch':
        providerDto = await this.exchangeTokenTwitch(code);
        break;
      case 'spotify':
        providerDto = await this.exchangeTokenSpotify(code);
        break;
      case 'microsoft':
        providerDto = await this.exchangeTokenMicrosoft(code);
      default:
        throw new HttpException('Invalid provider', HttpStatus.BAD_REQUEST);
    }

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

  async disconnectProvider(provider: string, user: any) {
    console.log('disconnectProvider');
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

  async exchangeTokenGoogle(code: string): Promise<ProviderDto> {
    try {
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.API_URL + '/auth/callback',
        grant_type: 'authorization_code',
      });
      console.log(data);
      const idToken = data.id_token;
      const decoded = this.jwtService.decode(idToken);
      console.log(decoded);

      return {
        provider: 'google',
        email: decoded.email,
        token: data.access_token,
        refreshToken: data.refresh_token,
        accountId: decoded.sub,
      };
    } catch {
      console.error('Token exchange failed:');
      throw new HttpException(
        'Token exchange failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exchangeTokenDiscord(code: string): Promise<ProviderDto> {
    try {
      const { data } = await axios.post(
        'https://discord.com/api/oauth2/token',
        qs.stringify({
          code,
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
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
      const discordUser = await axios.get(
        'https://discord.com/api/v9/users/@me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(discordUser.data);

      return {
        provider: 'discord',
        email: discordUser.data.email,
        token: accessToken,
        refreshToken,
        accountId: discordUser.data.id,
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

  async exchangeTokenTwitch(code: string): Promise<ProviderDto> {
    console.log('exchangeTokenTwitch');

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
        token: accessToken,
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

  async exchangeTokenSpotify(code: string): Promise<ProviderDto> {
    console.log('exchangeTokenSpotify');

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
        token: accessToken,
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

  async exchangeTokenGithub(code: string): Promise<ProviderDto> {
    console.log('exchangeTokenGithub');

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
        email: githubUser.data.email ? githubUser.data.email : "null",
        token: accessToken,
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

  async exchangeTokenMicrosoft(code: string): Promise<ProviderDto> {
    console.log('exchangeTokenMicrosoft');

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
        token: accessToken,
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

  async listServices(user: any) {
    console.log('listServices');
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

import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProvidersService } from './services/providers.service';
import { GoogleService } from './services/google-provider.service';
import { GithubService } from './services/github-provider.service';
import { TwitchService } from './services/twitch-provider.service';
import { DiscordService } from './services/discord-provider.service';
import { SpotifyService } from './services/spotify-provider.service';
import { MicrosoftService } from './services/microsoft-provider.service';
import { StravaService } from './services/strava-provider.service';
import { FacebookService } from './services/facebook-provider.service';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    LogModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, ProvidersService, JwtStrategy,
    GoogleService, DiscordService, GithubService, TwitchService, SpotifyService, MicrosoftService, StravaService, FacebookService
  ],
  exports: [AuthService, ProvidersService, JwtModule],
})
export class AuthModule {}

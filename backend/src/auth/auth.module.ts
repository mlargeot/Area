import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { DiscordStrategy } from './strategies/discord.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GithubStrategy } from './strategies/github.startegy';
import { ProvidersService } from './services/providers.service';
import { GoogleService } from './services/google-provider.service';
import { GithubService } from './services/github-provider.service';
import { TwitchService } from './services/twitch-provider.service';
import { DiscordService } from './services/discord-provider.service';
import { SpotifyService } from './services/spotify-provider.service';
import { MicrosoftService } from './services/microsoft-provider.service';

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
  ],

  controllers: [AuthController],
  providers: [AuthService, ProvidersService, GoogleStrategy, DiscordStrategy, GithubStrategy, JwtStrategy,
    GoogleService, DiscordService, GithubService, TwitchService, SpotifyService, MicrosoftService
  ],
  exports: [AuthService, ProvidersService, JwtModule],
})
export class AuthModule {}

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
  providers: [AuthService, GoogleStrategy, DiscordStrategy, GithubStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

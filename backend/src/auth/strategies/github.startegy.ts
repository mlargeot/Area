import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
    ) {
    const { username, id, photos, emails } = profile;
  
    const user = {
      email: emails?.[0]?.value || null, // Email principal (si disponible)
      username, // Nom d'utilisateur GitHub
      githubId: id, // Identifiant unique GitHub
      avatar: photos?.[0]?.value || null, // Photo de profil
      accessToken, // Jeton d'accès pour effectuer des requêtes API
    };
  
    // Passe l'utilisateur au callback
    done(null, user);
  }
}
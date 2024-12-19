import { 
    BadRequestException,
    Injectable, 
    NotFoundException
} from '@nestjs/common';
import {
    User, 
    UserDocument
} from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GithubActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async initPullRequestWebhook(userId: string, params: {name: string, githubRepoUrl: string}) {
    const { name, githubRepoUrl } = params;
    const user = await this.userModel.findOne({ _id: userId });

    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubRepoUrl.match(regex);
    if (!match)
      throw new BadRequestException('InitAssign: invalid github repository URL (e.g: https://github.com/owner/repository)')

    const githubProvider = user.oauthProviders?.find((provider) => provider.provider === 'github');
    if (!githubProvider || !githubProvider.accessToken)
      throw new NotFoundException(`GitHub access token not found for user with ID ${userId}.`);  

    const githubAccessToken = githubProvider.accessToken;

    const data = {
      name: name,
      config: {
        url: this.configService.get<string>('WEBHOOK_ENDPOINT') + "webhook/github/pr",
        content_type: 'json',
      },
      events: ["pull_request"],
      active: true
    };

    const headers = { Authorization: `Bearer ${githubAccessToken}`,
      accept: `application/vnd.github+json`
    }

    try {
      const response = await lastValueFrom(this.httpService.post(`https://api.github.com/repos/${match[1]}/${match[2]}/hooks`, data, { headers }));
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création du webhook : ${error.message}`);
    }
  }
}

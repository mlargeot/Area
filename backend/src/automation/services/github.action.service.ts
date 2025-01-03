import { 
    BadRequestException,
    Injectable, 
    UnauthorizedException
} from '@nestjs/common';
import {
    User, 
    UserDocument
} from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
    Model,
    Types
} from 'mongoose';
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

  /**
  * Checks if an existing webhook with the same configuration already exists for a given user.
  * This helps prevent duplicate webhook or applet creation for the same repository and event type.
  * 
  * @param userId - The ID of the user in the database (retrieved from the token).
  * @param githubRepoUrl - The URL of the repository being targeted.
  * @param trigger - The event type that triggers the webhook (e.g., "pull_request").
  * @returns The metadata of a matching applet if found, otherwise null.
  */
  async isExistingWebhook(
    userId: string,
    githubRepoUrl: string,
    trigger: string
  ): Promise<Record<string, any> | null> {
    const result = await this.userModel.aggregate([
      { $match: { _id: new Types.ObjectId(userId) }, },
      { $unwind: '$applets', },
      {
        $match: {
          'applets.action.params.githubRepoUrl': githubRepoUrl,
          'applets.metadata.response.events': { $in: [trigger] },
        },
      },
      {
        $project: {
          _id: 0,
          metadata: '$applets.metadata',
        },
      },
    ]);

    if (result.length > 0)
      return result[0].metadata;
    else
      return null;
  }

  /**
   * Initializes a GitHub webhook for the `pull_request` event type on a specified repository.
   * This webhook is used to trigger applets when specific actions occur on the repository.
   *
   * @param userId - The ID of the user in the database (retrieved from the token).
   * @param params - An object containing:
   *   - `name`: The name of the webhook to create.
   *   - `githubRepoUrl`: The URL of the GitHub repository where the webhook will be created.
   *
   * @returns The response data from the GitHub API after creating the webhook.
   *
   * @throws BadRequestException - If the provided `githubRepoUrl` is invalid.
   * @throws NotFoundException - If the user's GitHub access token is not found.
   * @throws Error - If the GitHub API call to create the webhook fails, with the error message.
   */
  async initPullRequestWebhook(userId: string, params: {githubRepoUrl: string}) {
    const { githubRepoUrl } = params;

    const existingWebhook = await this.isExistingWebhook(userId, githubRepoUrl, "pull_request");
    if (existingWebhook)
      return existingWebhook["response"];

    const user = await this.userModel.findOne({ _id: userId });
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubRepoUrl.match(regex);
    if (!match)
      throw new BadRequestException('InitAssign: invalid github repository URL (e.g: https://github.com/owner/repository)')

    const githubProvider = user.oauthProviders?.find((provider) => provider.provider === 'github');
    if (!githubProvider || !githubProvider.accessToken)
      throw new UnauthorizedException(`GitHub access token not found for user with ID ${userId}.`);  

    const githubAccessToken = githubProvider.accessToken;

    const data = {
      name: "web",
      config: {
        url: this.configService.get<string>('WEBHOOK_ENDPOINT') + "webhook/github/pr",
        content_type: "json"
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

  async destroyPullRequestWebhook(userId: string, metadata: {}) {
    return;
  }
}

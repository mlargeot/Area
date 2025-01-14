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
      throw new BadRequestException('Invalid github repository URL (e.g: https://github.com/owner/repository)')

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
      response.data["owner"] = match[1];
      response.data["repository"] = match[2];
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création du webhook : ${error.message}`);
    }
  }


  /**
   * Initializes a GitHub webhook for the `dependabot_alert` event type on a specified repository.
   * This webhook is used to trigger applets when specific actions occur on the repository.
   *
   * @param userId - The ID of the user in the database (retrieved from the token).
   * @param params - An object containing:
   *   - `githubRepoUrl`: The URL of the GitHub repository where the webhook will be created.
   *
   * @returns The response data from the GitHub API after creating the webhook.
   *
   * @throws BadRequestException - If the provided `githubRepoUrl` is invalid.
   * @throws NotFoundException - If the user's GitHub access token is not found.
   * @throws Error - If the GitHub API call to create the webhook fails, with the error message.
   */
  async initDependabotWebhook(userId: string, params: {githubRepoUrl: string}) {
    const { githubRepoUrl } = params;

    const existingWebhook = await this.isExistingWebhook(userId, githubRepoUrl, "dependabot_alert");
    if (existingWebhook)
      return existingWebhook["response"];

    const user = await this.userModel.findOne({ _id: userId });
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubRepoUrl.match(regex);
    if (!match)
      throw new BadRequestException('Invalid github repository URL (e.g: https://github.com/owner/repository)')

    const githubProvider = user.oauthProviders?.find((provider) => provider.provider === 'github');
    if (!githubProvider || !githubProvider.accessToken)
      throw new UnauthorizedException(`GitHub access token not found for user with ID ${userId}.`);  

    const githubAccessToken = githubProvider.accessToken;

    const data = {
      name: "web",
      config: {
        url: this.configService.get<string>('WEBHOOK_ENDPOINT') + "webhook/github/security",
        content_type: "json"
      },
      events: ["dependabot_alert"],
      active: true
    };

    const headers = { Authorization: `Bearer ${githubAccessToken}`,
      accept: `application/vnd.github+json`
    }

    try {
      const response = await lastValueFrom(this.httpService.post(`https://api.github.com/repos/${match[1]}/${match[2]}/hooks`, data, { headers }));
      response.data["owner"] = match[1];
      response.data["repository"] = match[2];
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création du webhook : ${error.message}`);
    }
  }

  /**
   * Initializes a GitHub webhook for the `push` event type on a specified repository.
   * This webhook is used to trigger applets when specific actions occur on the repository.
   *
   * @param userId - The ID of the user in the database (retrieved from the token).
   * @param params - An object containing:
   *   - `githubRepoUrl`: The URL of the GitHub repository where the webhook will be created.
   *
   * @returns The response data from the GitHub API after creating the webhook.
   *
   * @throws BadRequestException - If the provided `githubRepoUrl` is invalid.
   * @throws NotFoundException - If the user's GitHub access token is not found.
   * @throws Error - If the GitHub API call to create the webhook fails, with the error message.
   */
  async initPushWebhook(userId: string, params: {githubRepoUrl: string}) {
    const { githubRepoUrl } = params;

    const existingWebhook = await this.isExistingWebhook(userId, githubRepoUrl, "push");
    if (existingWebhook)
      return existingWebhook["response"];

    const user = await this.userModel.findOne({ _id: userId });
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubRepoUrl.match(regex);
    if (!match)
      throw new BadRequestException('Invalid github repository URL (e.g: https://github.com/owner/repository)')

    const githubProvider = user.oauthProviders?.find((provider) => provider.provider === 'github');
    if (!githubProvider || !githubProvider.accessToken)
      throw new UnauthorizedException(`GitHub access token not found for user with ID ${userId}.`);  

    const githubAccessToken = githubProvider.accessToken;

    const data = {
      name: "web",
      config: {
        url: this.configService.get<string>('WEBHOOK_ENDPOINT') + "webhook/github/push",
        content_type: "json"
      },
      events: ["push"],
      active: true
    };

    const headers = { Authorization: `Bearer ${githubAccessToken}`,
      accept: `application/vnd.github+json`
    }

    try {
      const response = await lastValueFrom(this.httpService.post(`https://api.github.com/repos/${match[1]}/${match[2]}/hooks`, data, { headers }));
      response.data["owner"] = match[1];
      response.data["repository"] = match[2];
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création du webhook : ${error.message}`);
    }
  }

  /**
  * Initializes a webhook for GitHub issue events on a specified repository.
  * 
  * This method checks if a webhook for issue events already exists for the given user and repository.
  * If a webhook exists, it returns the existing webhook data. Otherwise, it creates a new webhook
  * for the specified repository and associates it with the "issues" event.
  * 
  * @param userId - The ID of the user for whom the webhook is being initialized.
  * @param params - An object containing the GitHub repository URL.
  * 
  * @throws {BadRequestException} If the provided GitHub repository URL is invalid.
  * @throws {UnauthorizedException} If the user's GitHub OAuth access token is not found.
  * @throws {Error} If the GitHub API request fails during webhook creation.
  * 
  * @returns {Promise<any>} A promise that resolves to the webhook response data if successful.
  * 
  * Example usage:
  * ```typescript
  * const webhookResponse = await initIssuesWebhook(userId, { githubRepoUrl: "https://github.com/owner/repository" });
  * console.log(webhookResponse);
  * ```
  */
  async initIssuesWebhook(userId: string, params: {githubRepoUrl: string}) {
    const { githubRepoUrl } = params;

    const existingWebhook = await this.isExistingWebhook(userId, githubRepoUrl, "issues");
    if (existingWebhook)
      return existingWebhook["response"];

    const user = await this.userModel.findOne({ _id: userId });
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubRepoUrl.match(regex);
    if (!match)
      throw new BadRequestException('Invalid github repository URL (e.g: https://github.com/owner/repository)')

    const githubProvider = user.oauthProviders?.find((provider) => provider.provider === 'github');
    if (!githubProvider || !githubProvider.accessToken)
      throw new UnauthorizedException(`GitHub access token not found for user with ID ${userId}.`);  

    const githubAccessToken = githubProvider.accessToken;

    const data = {
      name: "web",
      config: {
        url: this.configService.get<string>('WEBHOOK_ENDPOINT') + "webhook/github/issues",
        content_type: "json"
      },
      events: ["issues"],
      active: true
    };

    const headers = { Authorization: `Bearer ${githubAccessToken}`,
      accept: `application/vnd.github+json`
    }

    try {
      const response = await lastValueFrom(this.httpService.post(`https://api.github.com/repos/${match[1]}/${match[2]}/hooks`, data, { headers }));
      response.data["owner"] = match[1];
      response.data["repository"] = match[2];
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création du webhook : ${error.message}`);
    }
  }

  /**
  * Destroy a Github Webhook applet associated with a given repository.
  * This service handles the deletion of an applet linked to a GitHub repository and ensures
  * the webhook and associated metadata are removed from the user's account.
  * 
  * @param {string} userId - The unique identifier of the user whose applet needs to be deleted.
  * @param {Object} metadata - The metadata object containing details to locate and delete the webhook applet.
  * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean containing the operation status.
  * @throws {Error} - Throws an error if the deletion fails or the applet is not found.
  * 
  * @example
  * try {
  *   const result = await destroyPullRequestWebhook("677acab17e5c72dd025edfec", {
  *     response: {
  *       id: 522590632,
  *       owner: "mlargeot",
  *       repository: "AR3M_tests"
  *     }
  *   });
  *   console.log("Webhook deleted successfully:", result);
  * } catch (error) {
  *   console.error("Error deleting webhook:", error.message);
  * }
  */
  async destroyGithubWebhook(userId: string, metadata: any): Promise<boolean> {

    const hookId = metadata?.response?.id;
    const owner = metadata?.response?.owner;
    const repository = metadata?.response?.repository;

    if (!hookId || !owner || !repository) {
        throw new Error('Invalid metadata: Missing required webhook information');
    }

    const appletsUsingWebhook = await this.userModel.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      { $unwind: "$applets" },
      {
          $match: {
              "applets.metadata.response.id": Number(hookId),
              "applets.metadata.response.owner": owner,
              "applets.metadata.response.repository": repository,
          },
      },
    ]);

    if (appletsUsingWebhook.length > 1) {
        console.log(`Webhook ${hookId} is still used by ${appletsUsingWebhook.length} applets.`);
        return false;
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const githubProvider = user.oauthProviders.find(provider => provider.provider === 'github');
    if (!githubProvider || !githubProvider.accessToken) {
        throw new Error('GitHub access token not found for the user');
    }

    const githubApiUrl = `https://api.github.com/repos/${owner}/${repository}/hooks/${hookId}`;
    const response = await fetch(githubApiUrl, {
        method: 'DELETE',
        headers: {
            Authorization: `token ${githubProvider.accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        console.log(`Webhook ${hookId} deleted successfully`);
        return true;
    } else {
        const error = await response.json();
        console.error(`Failed to delete webhook: ${error.message}`);
        throw new Error(`Failed to delete webhook: ${error.message}`);
    }
  }
}

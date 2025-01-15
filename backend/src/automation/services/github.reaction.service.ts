import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
    User, 
    UserDocument
} from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
    Model,
    Types
} from 'mongoose';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReactionsGithubService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService
  ) {}

  /**
  * Sends a comment to a specified GitHub issue.
  *
  * @async
  * @function sendCommentToIssue
  * @param {string} userId - The ID of the user triggering the action.
  * @param {Object} params - The parameters for the reaction.
  * @param {string} params.issue_url - The URL of the GitHub issue (e.g., "https://github.com/owner/repository/issues/1").
  * @param {string} params.comment - The comment to post on the issue.
  * 
  * @returns {Promise<any>} The response from the GitHub API after posting the comment.
  * 
  * @throws {BadRequestException} If the issue URL is invalid.
  * @throws {UnauthorizedException} If the user's GitHub access token is not found.
  * @throws {Error} If the request to GitHub fails.
  *
  * @example
  * const response = await sendCommentToIssue(userId, {
  *   issue_url: "https://github.com/owner/repository/issues/1",
  *   comment: "This is an automated comment.",
  * });
  * console.log(response);
  */
  async sendCommentToIssue(userId: string, params: { issue_url: string; comment: string }) {
    const { issue_url, comment } = params;

    const match = issue_url.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
    if (!match) {
      throw new BadRequestException('Invalid GitHub issue URL.');
    }
    const [, owner, repo, issue_number] = match;

    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });
    const githubProvider = user.oauthProviders?.find(provider => provider.provider === 'github');
    if (!githubProvider || !githubProvider.accessToken) {
      throw new UnauthorizedException(`GitHub access token not found for user with ID ${userId}.`);
    }
    const githubAccessToken = githubProvider.accessToken;

    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`;
    const headers = {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept: 'application/vnd.github+json',
    };
    const body = { body: comment };

    try {
      const response = await lastValueFrom(this.httpService.post(url, body, { headers }));
      return response.data;
    } catch (error) {
      throw new Error(`Failed to post comment: ${error.message}`);
    }
  }
}

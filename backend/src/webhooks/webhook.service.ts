import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    User,
    UserDocument
} from 'src/schemas/user.schema';
import { Applet } from 'src/schemas/applet.schema';
import { ReactionsService } from 'src/automation/services/default.reaction.service';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reactionsService : ReactionsService
  ) {}

// --------------------------------------------- [GITHUB PR WEBHOOK] --------------------------------------------- // 

  /**
  * Handles the assignment of a user to a Pull Request (PR).
  * 
  * This method is triggered when a user is assigned to a PR. It checks for any 
  * active applets that are subscribed to the 'pr_assigned' action for the specific 
  * GitHub user and executes the corresponding reactions for those applets.
  * 
  * @param githubId - The GitHub account ID of the user who has been assigned to the PR.
  * 
  * @returns {Promise<boolean>} A promise that resolves to `true` if the process 
  * completes successfully, indicating that the PR assignee event has been handled 
  * and the associated reactions have been triggered.
  * 
  */
  async handlePRAssignee(githubId: number): Promise<boolean> {
    const triggeredApplets = await this.userModel.aggregate([
      {
        $match: {
          oauthProviders: {
            $elemMatch: { provider: 'github', accountId: githubId }
          }
        }
      },
      { $unwind: '$applets' },
      {
        $match: {
          'applets.active': true,
          'applets.action.name': 'pr_assigned'
        }
      },
      { $replaceRoot: { newRoot: '$applets' } }
    ]);

    for (const applet of triggeredApplets) {
      await this.reactionsService.executeReaction(applet.reaction.name, applet.reaction.params);
    }

    return true;
  }

  /**
  * Handles Pull Request (PR) state changes (e.g., opened, closed, reopened).
  * 
  * This method checks the current PR state action (opened, closed, or reopened) 
  * and triggers the corresponding reactions for any active applets that are 
  * subscribed to this action and match the repository and owner.
  * 
  * @param action - The PR action that was triggered. This can be one of the following:
  *    - 'opened'
  *    - 'closed'
  *    - 'reopened'
  * 
  * @param repositoryName - The full name of the GitHub repository where the PR 
  * action occurred. It follows the format: `owner/repository`, where `owner` is 
  * the GitHub username or organization name, and `repository` is the repository name.
  * 
  * @returns {Promise<boolean>} A promise that resolves to `true` if the process 
  * completes successfully, indicating that the PR state event has been handled and 
  * the associated reactions have been triggered.
  * 
  */
  async handlePRState(action: string, repositoryName: string): Promise<boolean> {
    const actionName = `pr_${action}`
    const owner = repositoryName.split('/')[0];
    const repository = repositoryName.split('/')[1];
    const triggeredApplets = await this.userModel.aggregate([
      {
        $match: {
          oauthProviders: {
            $elemMatch: { provider: 'github'}
          }
        }
      },
      { $unwind: '$applets' },
      {
        $match: {
          'applets.active': true,
          'applets.action.name': actionName,
          'applets.metadata.response.owner': owner,
          'applets.metadata.response.repository': repository
        }
      },
      { $replaceRoot: { newRoot: '$applets' } }
    ]);

    for (const applet of triggeredApplets) {
      await this.reactionsService.executeReaction(applet.reaction.name, applet.reaction.params);
    }

    return true;
  }

  /**
  * Handles events triggered by Pull Requests (PR) actions.
  * 
  * This function processes different PR events and performs the associated 
  * actions based on the type of PR action specified in the request body.
  * 
  * @param body - The event body containing the PR action and related data.
  * The body should include an `action` field that indicates the PR event type
  * (e.g., 'assigned', 'opened', 'closed', 'reopened', etc.), and depending on
  * the action, the function performs corresponding tasks. 
  * 
  * The structure of the body will vary based on the action:
  * - `assigned`: The body should contain an `assignee` object with an `id` field.
  * - `opened`, `closed`, `reopened`: The body should contain a `repository` object 
  *   with a `full_name` field representing the repository name.
  * 
  * @returns {Promise<boolean>} A promise that resolves to `true` if the event is
  * successfully handled or if the event does not require further processing. 
  * If the event is not handled, it returns `true` as the default behavior.
  * 
  */
  async handlePREvent(body: any) {
    if (!("action" in body))
      return true;
  
    switch (body.action) {
      case 'assigned':
        return await this.handlePRAssignee(body["assignee"]["id"]);

      case 'opened':
      case 'closed':
      case 'reopened':
        return await this.handlePRState(body.action, body["repository"]["full_name"]);
  
      default:
        return true;
    }
  }

// --------------------------------------------- [GITHUB SECURITY WEBHOOK] --------------------------------------------- // 


  /**
  * Handles security alerts for a specific GitHub repository.
  * 
  * This method identifies applets configured to respond to `security_alert` actions
  * for a given repository. It processes the alert by executing the associated 
  * reactions for all matching applets.
  * 
  * @param repositoryName - The full name of the repository in the format `owner/repository`.
  * 
  * @returns {Promise<boolean>} A promise that resolves to `true` if the security alert 
  * was successfully handled and reactions were triggered.
  * 
  * ### Example Usage:
  * ```typescript
  * await handleSecurityAlert("owner-name/example-repo");
  * ```
  * 
  * ### Notes:
  * - Ensure the `repositoryName` follows the format `owner/repository`.
  * - The reactions for each applet are executed asynchronously.
  */
  async handleSecurityAlert(type: string, repositoryName: string) {
    const owner = repositoryName.split('/')[0];
    const repository = repositoryName.split('/')[1];
    const triggeredApplets = await this.userModel.aggregate([
      {
        $match: {
          oauthProviders: {
            $elemMatch: { provider: 'github'}
          }
        }
      },
      { $unwind: '$applets' },
      {
        $match: {
          'applets.active': true,
          'applets.action.name': `security_${type}`,
          'applets.metadata.response.owner': owner,
          'applets.metadata.response.repository': repository
        }
      },
      { $replaceRoot: { newRoot: '$applets' } }
    ]);

    for (const applet of triggeredApplets) {
      await this.reactionsService.executeReaction(applet.reaction.name, applet.reaction.params);
    }
  
    return true;
  }

  /**
  * Handles security-related events triggered by the GitHub webhook.
  * 
  * This method processes `dependabot_alert` events and identifies applets 
  * that are configured to respond to `security_alert` actions. Depending on 
  * the specific action type (e.g., new alert, alert fix), it triggers the 
  * corresponding reactions.
  * 
  * @param body - The payload of the webhook containing event details.
  * 
  * @returns {Promise<boolean>} A promise that resolves to `true` if the process 
  * completes successfully, indicating that the event has been handled and the 
  * associated reactions have been triggered.
  */
  async handleSecurityEvent(body: any): Promise<boolean> {
    if (!("action" in body))
      return true;

    switch (body.action) {
      case 'auto_reopened':
      case 'created':
      case 'reopened':
      case 'reintroduced':
        return await this.handleSecurityAlert("alert", body.repository.full_name);

      case 'auto_dismissed':
      case 'dismissed':
      case 'fixed':
        return await this.handleSecurityAlert("fix", body.repository.full_name);

      default:
        return true;
    }
  }

// --------------------------------------------- [GITHUB PUSH WEBHOOK] --------------------------------------------- // 

  /**
  * Handles GitHub push events triggered by the webhook.
  * 
  * This method processes `push` events and identifies applets configured to respond to the `push` action
  * for a specific repository. It retrieves the relevant applets from the database and executes their
  * associated reactions.
  * 
  * @param body - The payload of the GitHub webhook event.
  * 
  * @returns {Promise<boolean>} A promise that resolves to `true` after processing the event
  * and executing the associated reactions, or immediately for test events.
  * 
  * @throws Will throw an error if the reaction execution fails or if the database query encounters issues.
  */
  async handlePushEvent(body: any): Promise<boolean> {
    if ("zen" in body)
      return true;
    const owner = body.repository.full_name.split('/')[0];
    const repository = body.repository.full_name.split('/')[1];
    const triggeredApplets = await this.userModel.aggregate([
      {
        $match: {
          oauthProviders: {
            $elemMatch: { provider: 'github'}
          }
        }
      },
      { $unwind: '$applets' },
      {
        $match: {
          'applets.active': true,
          'applets.action.name': `push`,
          'applets.metadata.response.owner': owner,
          'applets.metadata.response.repository': repository
        }
      },
      { $replaceRoot: { newRoot: '$applets' } }
    ]);

    for (const applet of triggeredApplets) {
      await this.reactionsService.executeReaction(applet.reaction.name, applet.reaction.params);
    }
    return true;
  }
}

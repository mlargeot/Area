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

// --------------------------------------------- [XXXX WEBHOOK] --------------------------------------------- // 
}

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

  async handlePREvent(body: any) {
    if ("action" in body) {
      if (body.action === 'assigned') {
        return await this.handlePRAssignee(body["assignee"]["id"]);
      }
    }
    return;
  }

// --------------------------------------------- [XXXX WEBHOOK] --------------------------------------------- // 
}

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

  async findTriggeredApplets(githubId: string): Promise<Applet[]> {
    return await this.userModel.aggregate([
      { $match: { 'githubId': githubId } },
      { $unwind: '$applets' },
      { $match: { 
          'applets.active': true, 
          'applets.action.name': 'pr_assigned' 
      } },
  
      { $replaceRoot: { newRoot: '$applets' } }
    ]);
  }

  async triggerAssign(body: any) {
    if (body.action !== 'assigned')
      return;

    const githubId = body.assignee.id;
    const triggeredApplets = await this.findTriggeredApplets(githubId);

    for (const applet of triggeredApplets) {
      await this.reactionsService.executeReaction(applet.reaction.name, applet.reaction.params);
    }
  }
}

import axios from 'axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Cron,
  CronExpression
} from '@nestjs/schedule';
import {
  User, 
  UserDocument
} from 'src/schemas/user.schema';
import {
  Model,
  Types
 } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReactionsService } from 'src/automation/services/default.reaction.service';
import { LogService } from 'src/log/log.service';

@Injectable()
export class OutlookEventsActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reactionsService : ReactionsService,
    private logService: LogService,
  ) {}

  private async getEmails(accessToken: string) {
    //get last ten emails
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/events?$top=10`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    // return last email
    return response.data.value[0];
  }


  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkEmails() {
    console.log('Checking new_calendar_event...');
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'new_calendar_event',
      }).select('applets oauthProviders');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'new_calendar_event');
        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;
          const { accessToken } = user.oauthProviders.find(provider => provider.provider === 'microsoft');
          if (!accessToken) {
            throw new UnauthorizedException('Outlook provider not connected.');
          }
          const { id } = applet.metadata.response;
          const newlastemail = await this.getEmails(accessToken);

          if (newlastemail.id !== id) {
            console.log('New email found!');
            await this.setNewEmail(newlastemail.id, userId, appletId);

            await this.logService.createLog(
              userId,
              applet.name,
              'success',
              'New email received',
            );
            await this.reactionsService.executeReaction(userId, reaction.name, reaction.params);

          }

        }
      }
    } catch (error) {
      console.error('action: new_email', error.message);
      console.error('Failed to process active applets:', error.message);
    }
  }



  async initCalendarCheck(userId: string) {
    console.log('Init Outlook Mail Action');
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { accessToken } = user.oauthProviders.find(provider => provider.provider === 'microsoft');
    if (!accessToken) {
      throw new UnauthorizedException('Outlook provider not connected.');
    }

    const lastemail = await this.getEmails(accessToken);
    console.log(lastemail);
    const id = lastemail.id;
    return {
      id,
    };
  }

  private async setNewEmail(id: string, userId: string, appletId: string) {
    await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId),
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.metadata.response.id': id,
        },
      }
    );
  }

}

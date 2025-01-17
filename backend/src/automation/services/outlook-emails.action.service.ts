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
export class OutlookEmailsActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reactionsService : ReactionsService,
    private logService: LogService,
  ) {}

  private async getEmails(accessToken: string, lastChecked: string) {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/messages?$filter=receivedDateTime ge ${lastChecked}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data.value.map(email => ({
      id: email.id,
      subject: email.subject,
      sender: email.from.emailAddress.address,
      receivedDateTime: email.receivedDateTime,
    }));
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkEmails() {
    console.log('Checking emails...');
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'new_email',
      }).select('applets oauthProviders');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'new_email');
        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;
          const { accessToken } = user.oauthProviders.find(provider => provider.provider === 'microsoft');
          if (!accessToken) {
            throw new UnauthorizedException('Outlook provider not connected.');
          }

          const lastChecked = applet.metadata.lastChecked || new Date(0).toISOString();
          const newEmails = await this.getEmails(accessToken, lastChecked);

          if (newEmails.length > 0) {
            console.log(`New emails found: ${newEmails.length}`);
            await this.setLastChecked(new Date().toISOString(), userId, appletId);
            await this.logService.createLog(
              userId,
              applet.name,
              'success',
              `${newEmails.length} new email(s) detected.`,
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

  private async setLastChecked(lastChecked: string, userId: string, appletId: string) {
    await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId),
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.metadata.lastChecked': lastChecked,
        },
      }
    );
  }

  async initEmailCheck(userId: string, params: {}) {
    console.log('Initializing email check...');
    
    // Step 1: Fetch user
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
  
    // Step 2: Check for Microsoft provider
    const { accessToken } = user.oauthProviders.find(provider => provider.provider === 'microsoft');
    if (!accessToken) {
      throw new UnauthorizedException('Outlook provider not connected.');
    }
  
    // Step 3: Fetch initial email state (optional)
    const lastChecked = new Date().toISOString(); // Use current timestamp as the starting point
    let initialEmails = [];
    try {
      initialEmails = await this.getEmails(accessToken, lastChecked);
    } catch (error) {
      console.warn('Failed to fetch initial emails:', error.message);
    }
  
    // Step 4: Update applet metadata
    const applet = {
      appletId: new Types.ObjectId().toString(),
      name: 'new_email',
      action: { name: 'new_email', params },
      reaction: {}, // Add the reaction you want to trigger here
      active: true,
      metadata: {
        lastChecked,
        initialEmails,
      },
    };
  
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $push: { applets: applet } }
    );
  
    console.log('Email check initialized successfully.');
    return applet;
  }
}

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

  private async getCalendarEvents(accessToken: string, lastChecked: string) {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/events?$filter=start/dateTime ge ${lastChecked}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data.value.map(event => ({
      id: event.id,
      subject: event.subject,
      start: event.start.dateTime,
      end: event.end.dateTime,
      location: event.location.displayName,
    }));
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkCalendarEvents() {
    console.log('Checking calendar events...');
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'new_calendar_event',
      }).select('applets oauthProviders');

      for (const user of users) {
        const activeApplets = user.applets.filter(
          applet => applet.active && applet.action.name === 'new_calendar_event',
        );
        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;
          const { accessToken } = user.oauthProviders.find(
            provider => provider.provider === 'microsoft',
          );
          if (!accessToken) {
            throw new UnauthorizedException('Outlook provider not connected.');
          }

          const lastChecked = applet.metadata.lastChecked || new Date(0).toISOString();
          const newEvents = await this.getCalendarEvents(accessToken, lastChecked);

          if (newEvents.length > 0) {
            console.log(`New calendar events found: ${newEvents.length}`);
            await this.setLastChecked(new Date().toISOString(), userId, appletId);
            await this.logService.createLog(
              userId,
              applet.name,
              'success',
              `${newEvents.length} new event(s) detected.`,
            );
            await this.reactionsService.executeReaction(userId, reaction.name, reaction.params);
          }
        }
      }
    } catch (error) {
      console.error('action: outlook-events', error.message);
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
      },
    );
  }

  async initCalendarCheck(userId: string, params: {}) {
    console.log('Initializing calendar check...');

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { accessToken } = user.oauthProviders.find(provider => provider.provider === 'microsoft');
    if (!accessToken) {
      throw new UnauthorizedException('Outlook provider not connected.');
    }

    const lastChecked = new Date().toISOString(); // Use current timestamp as the starting point
    let initialEvents = [];
    try {
      initialEvents = await this.getCalendarEvents(accessToken, lastChecked);
    } catch (error) {
      console.warn('Failed to fetch initial calendar events:', error.message);
    }

    const applet = {
      appletId: new Types.ObjectId().toString(),
      name: 'new_calendar_event',
      action: { name: 'new_calendar_event', params },
      reaction: {},
      active: true,
      metadata: {
        lastChecked,
        initialEvents,
      },
    };

    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $push: { applets: applet } },
    );

    console.log('Calendar check initialized successfully.');
    return applet;
  }

}

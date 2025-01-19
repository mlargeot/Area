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
export class YoutubeActionsService {
  private readonly YOUTUBE_API_URL = 'https://www.googleapis.com';
  private readonly YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reactionsService : ReactionsService,
    private logService: LogService,
  ) {}

  async getVideoNumber(channelId: string, apiKey: string): Promise<any> {
    console.log(channelId, apiKey);
    const response = await axios.get(`${this.YOUTUBE_API_URL}/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);

    return response.data.items[0].statistics.videoCount;
  }

  async initYouTubeAction(userId: string, params: { channelId: string }) {
    console.log('Init YouTube Action');
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { channelId } = params;

    try {
      console.log('Fetching YouTube data...');
      const videoNumber = await this.getVideoNumber(channelId, this.YOUTUBE_API_KEY);
      console.log('YouTube data fetched:', videoNumber);
      return {
        videoNumber,
      };
    } catch (error) {
      console.error('Failed to fetch YouTube data:', error.message);
      throw new BadRequestException(error.message);
    }

  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkNewVideos() {
    console.log('Checking for new videos...');
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'new_video',
      }).select('applets apiKeys');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.action.name === 'new_video');
        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;

          const { videoNumber } = applet.metadata.response;
          console.log('Checking for new videos on channel:', applet.action.params.channelId);
          console.log('Current video number:', videoNumber);
          const newVideoNumber = await this.getVideoNumber(applet.action.params.channelId, this.YOUTUBE_API_KEY);
          console.log('New video number:', newVideoNumber);
          console.log(videoNumber, newVideoNumber);
          if (videoNumber < newVideoNumber) {
            console.log('New video found!');
            await this.setNewVideoNumber(newVideoNumber, userId, appletId);
            await this.reactionsService.executeReaction(userId, reaction.name, reaction.params);
          }
        }
      }
    } catch (error) {
      console.error('action: new_video_on_channel', error.message);
      console.error('Failed to process active applets:', error.message);
    }
  }

  private async setNewVideoNumber(videoNumber: number, userId: string, appletId: string) {
    await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId),
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.metadata.response.videoNumber': videoNumber,
        },
      }
    );
  }

}

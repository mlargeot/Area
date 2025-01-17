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
  private readonly YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
  private readonly YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reactionsService : ReactionsService,
    private logService: LogService,
  ) {}

  async getUploadsPlaylistId(channelId: string, apiKey: string): Promise<string> {
    const response = await axios.get(`${this.YOUTUBE_API_URL}/channels`, {
      params: {
        part: 'contentDetails',
        id: channelId,
        key: apiKey,
      },
    });

    const uploadsPlaylistId = response.data.items[0]?.contentDetails.relatedPlaylists.uploads;
    if (!uploadsPlaylistId) {
      throw new NotFoundException('Uploads playlist not found.');
    }
    return uploadsPlaylistId;
  }

  async getPlaylistItems(playlistId: string, apiKey: string): Promise<any[]> {
    const response = await axios.get(`${this.YOUTUBE_API_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId,
        key: apiKey,
        maxResults: 10,
      },
    });
    return response.data.items;
  }

  async parseVideoList(videoList: any[]): Promise<any[]> {
    return videoList.map(video => ({
      id: video.snippet.resourceId.videoId,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
    }));
  }

  async initYouTubeAction(userId: string, params: { channelId: string }) {
    console.log('Init YouTube Action');
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { channelId } = params;

    const uploadsPlaylistId = await this.getUploadsPlaylistId(channelId, this.YOUTUBE_API_KEY);
    const playlistItems = await this.getPlaylistItems(uploadsPlaylistId, this.YOUTUBE_API_KEY);
    const parsedVideoList = await this.parseVideoList(playlistItems);

    console.log(parsedVideoList);
    return {
      uploadsPlaylistId,
      videoList: parsedVideoList,
    };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkNewVideos() {
    console.log('Checking for new videos...');
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'new_video_on_channel',
      }).select('applets apiKeys');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'new_video_on_channel');
        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;

          const { uploadsPlaylistId, videoList } = applet.metadata.response;
          const newPlaylistItems = await this.getPlaylistItems(uploadsPlaylistId, this.YOUTUBE_API_KEY);
          const newParsedVideoList = await this.parseVideoList(newPlaylistItems);

          if (newParsedVideoList.length > videoList.length) {
            await this.setNewVideoList(
              {
                uploadsPlaylistId,
                videoList: newParsedVideoList,
              },
              userId,
              appletId
            );
            await this.logService.createLog(
              userId,
              applet.name,
              'success',
              `New video detected on channel ${applet.action.params.channelId}`,
            );
            await this.reactionsService.executeReaction(userId, reaction.name, reaction.params);
          }
        }
      }
    } catch (error) {
      console.error('action: new_video_on_channel', error.message);
      console.error('Failed to process active applets:', error.message);
    }
  }

  private async setNewVideoList(newVideoList: { uploadsPlaylistId: string, videoList: any[] }, userId: string, appletId: string) {
    await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId),
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.metadata.response.videoList': newVideoList.videoList,
        },
      }
    );
  }

}

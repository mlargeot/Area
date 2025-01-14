import axios from 'axios';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  User, 
  UserDocument
} from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SpotifyAcitonsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  async getBroadcasterId(userId: string, broadcaster: string) {
    const user = await this.userModel.findOne({ _id: userId });
    const twitchProvider = user.oauthProviders?.find((provider) => provider.provider === 'twitch');

    if (!twitchProvider || !twitchProvider.accessToken)
        throw new UnauthorizedException(`Twitch access token not found for user with ID ${userId}.`);
    const twitchAccessToken = twitchProvider.accessToken;
    const headers = { 
        Authorization: `Bearer ${twitchAccessToken}`,
        "Client-Id": this.configService.get<string>('TWITCH_CLIENT_ID')
    };
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${broadcaster}`, { headers });
        const userData = response.data.data
        return userData[0].id;
    } catch (error) {
        throw new InternalServerErrorException("Failed to retrieve broadcaster ID. Please try again.");
    }
  }

  async initStreamOnlineEvent(userId: string, params: { broadcaster: string }) {
    try {
        const url = "https://api.twitch.tv/helix/eventsub/subscriptions"
        const broadcasterId = this.getBroadcasterId(userId, params.broadcaster);
        const user = await this.userModel.findOne({ _id: userId });
        const twitchProvider = user.oauthProviders?.find((provider) => provider.provider === 'twitch');
    
        console.log("\nBroadcaster Id : ", broadcasterId)
        if (!twitchProvider || !twitchProvider.accessToken)
            throw new UnauthorizedException(`Twitch access token not found for user with ID ${userId}.`);
        const headers = {
            Authorization: `Bearer ${twitchProvider.accessToken}`,
            "Client-Id": this.configService.get<string>('TWITCH_CLIENT_ID'),
            "Content-Type": "application/json"
        };
        const body = {
            type: "stream.online",
            version: 1,
            condition: {
                broadcaster_user_id: broadcasterId
            },
            transport: {
                method: "webhook",
                callback: this.configService.get<string>('WEBHOOK_ENDPOINT') + 'webhook/twitch/livestart',
                secret: this.configService.get<string>('TWITCH_SECRET')
            }
        };
        try {
            const response = await lastValueFrom(this.httpService.post(url, body, { headers }));
            console.log("\nSuccessfully subscribed to stream start event: ", response.data, "\n");
        } catch (error) {
            throw new InternalServerErrorException(error.message_content);
        }
    } catch (error) {
        console.log("\nError while subscribing to stream start: ", error.message_content, "\n");
        throw new InternalServerErrorException(error.message_content);
    }
  }
}

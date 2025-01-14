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
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TwitchActionsService {
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
        console.log("\nData request: ", {
            url : `https://api.twitch.tv/helix/users?login=${broadcaster}`,
            Authorization: `Bearer ${twitchAccessToken}`,
            "Client-Id": this.configService.get<string>('TWITCH_CLIENT_ID')
        });
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${broadcaster}`, { headers });
        const userData = response.data.data
        return userData[0].id;
    } catch (error) {
        throw new InternalServerErrorException("Failed to retrieve broadcaster ID. Please try again. : ", error.message_content);
    }
  }

  async initStreamOnlineEvent(userId: string, params: { broadcaster: string }) {
    try {
        const url = "https://api.twitch.tv/helix/eventsub/subscriptions"
        const broadcasterId = await this.getBroadcasterId(userId, params.broadcaster);
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
            version: "1",
            condition: {
                broadcaster_user_id: `${broadcasterId}`
            },
            transport: {
                method: "webhook",
                callback: this.configService.get<string>('WEBHOOK_ENDPOINT') + 'webhook/twitch/livestart',
                secret: this.configService.get<string>('TWITCH_SECRET')
            }
        };
        console.log("\nREQUEST TO TWITCH: \n", headers, "\n", body);
        try {
            const response = await lastValueFrom(this.httpService.post(url, body, { headers }));
            console.log("\nSuccessfully subscribed to stream start event to ID: ", response.data.data[0].id, "\n");
            return { id: response.data.data[0].id };
        } catch (error) {
            throw new InternalServerErrorException(error.message_content);
        }
    } catch (error) {
        console.log("\nError while subscribing to stream start: ", error.message_content, "\n");
        throw new InternalServerErrorException(error.message_content);
    }
  }

  async destroyTwitchWebhook(userId: string, metadata: any) {
    const subscriptionId = metadata?.response?.id;

    if (!subscriptionId)
        return false;
    const appletsUsingWebhook = await this.userModel.aggregate([
        { $match: { _id: new Types.ObjectId(userId) } },
        { $unwind: "$applets" },
        {
            $match: {
                "applets.metadata.response.id": subscriptionId,
            },
        },
    ]);
    if (appletsUsingWebhook.length > 1) {
        console.log(`Webhook ${subscriptionId} is still used by other applets.`);
        return false;
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const twitchProvider = user.oauthProviders.find(provider => provider.provider === 'twitch');
    if (!twitchProvider || !twitchProvider.accessToken) {
        throw new Error('Twitch access token not found for the user');
    }

    const twitchApiUrl = `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`;
    const response = await fetch(twitchApiUrl, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${twitchProvider.accessToken}`,
            'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID')
        },
    });

    if (response.ok) {
        console.log(`Webhook ${subscriptionId} deleted successfully`);
        return true;
    } else {
        const error = await response.json();
        console.error(`Failed to delete webhook: ${error.message}`);
        throw new Error(`Failed to delete webhook: ${error.message}`);
    }
  }
}

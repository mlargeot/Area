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
export class StravaActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  async isExistingWebhook(event: string): Promise<any | null> {
    const result = await this.userModel.aggregate([
      {
        $match: {
            oauthProviders: {
            $elemMatch: { provider: 'strava'}
            }
        }
      },
      { $unwind: '$applets' },
      {
        $match: {
          'applets.metadata.response.event': event,
        },
      },
      {
        $project: {
          _id: 0,
          metadata: '$applets.metadata',
        },
      },
      { 
        $limit: 1
      },
    ]);
    console.log("\nVoila ce que j'ai trouvé pour existing applet : ", result);
    if (result.length > 0) {
      console.log("Existing subscription");  
      return result[0].metadata.response.sub_id;
    } else {
      console.log("No existing\n");
      return null;
    }
  }

  async initNewActivityEvent(userId: string, params: {}) {
    try {
        const url = "https://www.strava.com/api/v3/push_subscriptions"
        const user = await this.userModel.findOne({ _id: userId });
        const stravaProvider = user.oauthProviders?.find((provider) => provider.provider === 'strava');

        if (!stravaProvider || !stravaProvider.accessToken)
            throw new UnauthorizedException(`Twitch access token not found for user with ID ${userId}.`);
        const headers = { Authorization: `Bearer ${stravaProvider.accessToken}`};
        const userData = await axios.get('https://www.strava.com/api/v3/athlete', { headers });
        const hook = this.isExistingWebhook('newactivity');
        if (hook == null) {
            const body = {
                client_id: this.configService.get<string>('STRAVA_CLIENT_ID'),
                client_secret: this.configService.get<string>('STRAVA_CLIENT_SECRET'),
                callback_url: this.configService.get<string>('WEBHOOK_ENDPOINT') + 'webhook/strava/newactivity',
                verify_token: "strava"
            };
            try {
                const response = await lastValueFrom(this.httpService.post(url, body, { headers }));
                console.log("Response from strava :", response.data);
                return {
                    sub_id: response.data.id,
                    id: userData.data.id,
                    event: 'newactivity'
                };
            } catch (error) {
                throw new InternalServerErrorException(error.message_content);
            }
        }
        return {
            sub_id: hook,
            id: userData.data.id,
            event: 'newactivity',
        };
    } catch (error) {
        throw new InternalServerErrorException('Unexepected error occurs on Strava: ', error.message_content);
    }
  }

  async destroyStravaWebhook(userId: string, metadata: any) {
    const subscriptionId = metadata?.response?.sub_id;

    if (!subscriptionId)
        return false;
    const appletsUsingWebhook = await this.userModel.aggregate([
        {
            $match: {
                oauthProviders: {
                $elemMatch: { provider: 'strava'}
                }
            }
        },
        { $unwind: "$applets" },
        {
            $match: {
                "applets.metadata.response.sub_id": subscriptionId,
            },
        },
    ]);
    if (appletsUsingWebhook.length > 1) {
        console.log(`Webhook ${subscriptionId} is still used by others.`);
        return false;
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const stravaProvider = user.oauthProviders.find(provider => provider.provider === 'strava');
    if (!stravaProvider || !stravaProvider.accessToken) {
        throw new Error('Strava access token not found for the user');
    }

    const stravaApiUrl = `https://www.strava.com/api/v3/push_subscriptions/${subscriptionId}`;
    const params = {
        client_id: this.configService.get<string>('STRAVA_CLIENT_ID'),
        client_secret: this.configService.get<string>('STRAVA_CLIENT_SECRET'),
    };
    const response = await axios.delete(stravaApiUrl, { params })

    if (response.status === 204) {
        console.log(`Webhook ${subscriptionId} deleted successfully`);
        return true;
    } else {
        console.error(`Failed to delete webhook: ${response.data.message}`);
        throw new Error(`Failed to delete webhook: ${response.data.message}`);
    }
  }
}

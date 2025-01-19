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

@Injectable()
export class LeagueofLegendsActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reactionsService : ReactionsService
  ) {}

  async initLeagueofLegendsAction(userId: string, params: { playerName: string }) {
    const { playerName } = params;
    const name = playerName.split('#')[0];
    const tag = playerName.split('#')[1];

    console.log(name, tag);

    const puuid = await this.getPlayerPUUID(name, tag);
    if (!puuid) {
      throw new NotFoundException('Player not found.');
    }

    const matchHistory = await this.getMatchHistory(puuid);
    if (!matchHistory) {
      throw new NotFoundException('Match history not found.');
    }

    return {
      puuid,
      matchHistory,
    };
  }

  async initLeagueofLegendsStatusAction(userId: string, params: { playerName: string, type: string }) {
    const { playerName } = params;
    const name = playerName.split('#')[0];
    const tag = playerName.split('#')[1];

    console.log(name, tag);

    const puuid = await this.getPlayerPUUID(name, tag);
    if (!puuid) {
      throw new NotFoundException('Player not found.');
    }
  

    const status = await this.getPlayerStatus(puuid);

    return {
      puuid,
      status,
    };
  }


  private async getPlayerPUUID(playerName: string, tagLine: string): Promise<string> {
    console.log(playerName, tagLine, process.env.RIOT_API_KEY);
    try {
      const response = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/` + playerName + `/` + tagLine, {
        params: {
          api_key: process.env.RIOT_API_KEY,
        },
      });
      console.log(response.data);
      return response.data.puuid;
    } catch (error) {
      console.log(`Failed to fetch player PUUID: ${error.message}`);
      return null;
    }
  }

  private async getMatchHistory(puuid: string): Promise<any> {
    try {
      const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/` + puuid + `/ids`, {
        params: {
          api_key: process.env.RIOT_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch match history: ${error.message}`);
      return null;
    }
  }

  private async getPlayerStatus(puuid: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://europe.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/` + puuid, {
        params: {
          api_key: process.env.RIOT_API_KEY,
        },
      });
      return true;
    } catch (error) {
      console.log(`Failed to fetch player status: ${error.message}`);
      return false;
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkMatchHistory() {
    console.log('Checking match history... at ' + new Date().toISOString());
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'lol_match_history',
      }).select('applets');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'lol_match_history');
        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;

          const { puuid, matchHistory } = applet.metadata.response;
          const currentMatchHistory = await this.getMatchHistory(puuid);

          console.log(matchHistory.length, currentMatchHistory.length);
          console.log(matchHistory[matchHistory.length - 1], currentMatchHistory[currentMatchHistory.length - 1]);

          if (matchHistory[currentMatchHistory.length - 1] !== currentMatchHistory[currentMatchHistory.length - 1]) {
            await this.setNewMatchHistory(
              {
                newPUUID: puuid,
                newMatchHistory: currentMatchHistory,
              },
              userId,
              appletId
            );
            await this.reactionsService.executeReaction(userId, reaction.name, reaction.params);
          }
        }
      }
    } catch (error) {
      console.error('action: new_lol_match', error.message);

      console.error('Failed to process active applets:', error.message);
    }
    console.log('Checking players status... at ' + new Date().toISOString());
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'lol_users_activity',
      }).select('applets');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'lol_users_activity');
        for (const applet of activeApplets) {

          const { appletId, userId, reaction } = applet;

          const { puuid, status } = applet.metadata.response;

          const currentStatus = await this.getPlayerStatus(puuid);

          console.log(status, currentStatus);

          if (status !== currentStatus) {
            await this.setNewStatus(
              currentStatus,
              userId,
              appletId
            );
            if (currentStatus) {
              await this.reactionsService.executeReaction(userId, reaction.name, reaction.params);
            }
          }
        }
      }
    } catch (error) {
      console.error('action: new_lol_status', error.message);

      console.error('Failed to process active applets:', error.message);
    }
  }

  private async setNewMatchHistory(newMatchHistory: { newPUUID: string, newMatchHistory: any }, userId: string, appletId: string) {
    await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId),
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.metadata.response': newMatchHistory,
        },
      }
    );
  }

  private async setNewStatus(newStatus: boolean, userId: string, appletId: string) {
    await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId),
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.metadata.response': newStatus,
        },
      }
    );
  }
}

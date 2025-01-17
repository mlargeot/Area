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

  async initLeagueofLegendsAction(userId: string, params: { playerName: string, tagLine: string }) {
    const puuid = await this.getPlayerPUUID(params.playerName, params.tagLine);
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

  async initLeagueofLegendsStatusAction(userId: string, params: { playerlist: string, type: string }) {
    //list player
    const playerList : string[] = params.playerlist.split(',');
    //remove space
    playerList.forEach((player, index) => {
      playerList[index] = player.trim();
    });
    //get name and tag : name#tag
    const playerData = playerList.map((player) => {
      const [name, tag] = player.split('#');
      return {name, tag};
    });
    //get puuid
    const puuidList = await Promise.all(playerData.map(async (player) => {
      return await this.getPlayerPUUID(player.name, player.tag);
    }));

    //get status
    const statusList = await Promise.all(puuidList.map(async (puuid) => {
      return await this.getPlayerStatus(puuid);
    }));

    return {
      puuidList,
      statusList,
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

  private async getPlayerStatus(puuid: string): Promise<any> {
    try {
      const response = await axios.get(`https://europe.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/` + puuid, {
        params: {
          api_key: process.env.RIOT_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch player status: ${error.message}`);
      return null;
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkMatchHistory() {
    console.log('Checking match history...');
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'new_lol_match',
      }).select('applets');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'new_lol_match');
        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;

          const { puuid, matchHistory } = applet.metadata.response;
          const currentMatchHistory = await this.getMatchHistory(puuid);

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
      console.error('Failed to process active applets:', error.message);
    }
    console.log('Checking players status...');
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'new_lol_status',
      }).select('applets');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'new_lol_status');
        for (const applet of activeApplets) {

          
        }
      }
    } catch (error) {
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
}

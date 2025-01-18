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
import { title } from 'process';

@Injectable()
export class OutlookActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reactionsService : ReactionsService,
    private logService: LogService,
  ) {}

  async getListId(accessToken: string, listName: string) {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me/todo/lists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const taskList = response.data;
    const taskListId = taskList.value.find(list => list.displayName === listName)?.id;
    if (!taskListId) {
      throw new NotFoundException('Task list not found.');
    }
    return taskListId;
  }

  async getTaskList(accessToken: string, listId: string) {
    const response = await axios.get(`https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  async parseTaskList(taskList: any) {
    return taskList.value.map(task => {
      return {
        id: task.id,
        title: task.title,
        createdDateTime: task.createdDateTime,
      };
    });
  }

  async initOutlookTaskAction(userId: string, params: { listName: string }) {
    console.log('Init Outlook Task Action');
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const listName = params.listName;
    const { accessToken } = user.oauthProviders.find(provider => provider.provider === 'microsoft');
    if (!accessToken) {
      throw new UnauthorizedException('Outlook provider not connected.');
    }

    const listId = await this.getListId(accessToken, listName);
    const taskList = await this.getTaskList(accessToken, listId);
    const parsedTaskList = await this.parseTaskList(taskList);
    console.log(parsedTaskList);
    return {
      listId,
      taskList: parsedTaskList,
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkTasks() {
    console.log('Checking tasks...');
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'new_task_in_list',
      }).select('applets oauthProviders');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'new_task_in_list');
        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;
          const { accessToken } = user.oauthProviders.find(provider => provider.provider === 'microsoft');
          if (!accessToken) {
            throw new UnauthorizedException('Outlook provider not connected.');
          }
          const { listId, taskList } = applet.metadata.response;
          const newTaskList = await this.getTaskList(accessToken, listId);
          const newParsedTaskList = await this.parseTaskList(newTaskList);
          if (newParsedTaskList.length !== taskList.length) {
            await this.setNewTaskList(
              {
                listId,
                taskList: newParsedTaskList,
              },
              userId,
              appletId
            );
            await this.logService.createLog(
              userId,
              applet.name,
              'success',
              'New task detected in list ' + applet.action.params.listName,
            );
            const actionData: Record<string, any> = {
              title: newParsedTaskList[newParsedTaskList.length - 1].title,
            };
            await this.reactionsService.executeReaction(userId, reaction.name, reaction.params, actionData);
          }
        }
      }
    } catch (error) {
      console.error('action: new_task_in_list', error.message);

      console.error('Failed to process active applets:', error.message);
    }
  }

  private async setNewTaskList(newTaskList: { listId: string, taskList: any }, userId: string, appletId: string) {
    await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId),
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.metadata.response.taskList': newTaskList.taskList,
        },
      }
    );
  }
}

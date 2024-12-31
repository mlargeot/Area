import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AppletDto,
  AppletBodyDto,
  AppletModuleDto
} from 'src/applets/dto/applets.dto';
import { User } from 'src/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid'
import { ActionsService } from 'src/automation/services/default.action.service';

@Injectable()
export class AppletsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly actionsService : ActionsService
  ) {}

  async getApplets(
    userId: string
  ): Promise<AppletDto[]> {
    const user = await this.userModel.findById(userId).select('applets').lean();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (user.applets.length > 0)
      return user.applets;
    else
      return [];
  }

  async getAppletById(
    userId: string,
    appletId: string
  ): Promise<AppletDto> {
    const user = await this.userModel.findOne(
      { _id: userId, 'applets.appletId': appletId },
      { 'applets.$': 1 }
    ).lean();
  
    if (!user || !user.applets || user.applets.length === 0) {
      throw new NotFoundException(`Applet with ID ${appletId} not found for user ${userId}.`);
    }

    return user.applets[0];
  }

  async createApplet(
    userId: string,
    appletDto: AppletBodyDto
  ): Promise<AppletDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
  
    const newApplet: AppletDto = {
      appletId: uuidv4(),
      userId,
      action: null,
      reaction: appletDto.reaction,
      active: appletDto.active,
      metadata: null,
    };
  
    try {
      const actionResponse = await this.actionsService.executeAction(
        userId,
        appletDto.action.name,
        appletDto.action.params,
      );

      if (actionResponse) {
        newApplet.metadata = {
          "response": actionResponse
        }
      }

      const appletAction: AppletModuleDto = {
        name: appletDto.action.name,
        service: appletDto.action.service,
        params: appletDto.action.params,
      };
      newApplet.action = appletAction;
    } catch (error) {
      throw new Error(`Failed to init action "${appletDto.action.name}": ${error.message}`);
    }
  
    user.applets.push(newApplet);
    await user.save();  
    return newApplet;
  }

  async updateApplet(
    userId: string,
    appletId: string,
    appletDto: AppletBodyDto
  ): Promise<AppletDto> {
    const user = await this.userModel.findOne(
      {
        _id: userId,
        'applets.appletId': appletId,
      },
      { 'applets.$': 1 }
    ).lean();

    if (!user || !user.applets || user.applets.length === 0) {
      throw new NotFoundException(
        `Applet with ID ${appletId} not found for user ${userId}.`
      );
    }
  
    const existingApplet = user.applets[0];
  
    if (appletDto.action && appletDto.action !== null) {
      if (
        existingApplet.action.name !== appletDto.action.name ||
        JSON.stringify(existingApplet.action.params) !==
          JSON.stringify(appletDto.action.params)
      ) {
        // RE-INIT de l'action
        console.log(`Action successfully updated for applet: ${appletId}.`);
      }
    }
  
    const result = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.action': appletDto.action,
          'applets.$.reaction': appletDto.reaction,
          'applets.$.active': appletDto.active,
        },
      },
      { new: true, projection: { 'applets.$': 1 } }
    ).lean();  
    
    if (!result || !result.applets || result.applets.length === 0) {
      throw new NotFoundException(
        `Failed to update applet with ID ${appletId} for user ${userId}.`
      );
    }
    console.log(`New applet data set for user: ${userId}`);
    return result.applets[0];
  }
  

  async deleteApplet(
    userId: string,
    appletId: string
  ): Promise<boolean> {

    const user = await this.userModel.findOne(
      {
        _id: userId,
        'applets.appletId': appletId,
      },
      { 'applets.$': 1 }
    ).lean();

    if (!user || !user.applets || user.applets.length === 0) {
      throw new NotFoundException(
        `Applet with ID ${appletId} not found for user ${userId}.`
      );
    }

    // Destroy de l'action

    const result = await this.userModel.updateOne(
      { _id: userId, 'applets.appletId': appletId },
      { $pull: { applets: { appletId: appletId } } }
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        `Failed to delete applet with ID ${appletId} for user ${userId}.`
      );
    }  
    return true;
  }
}

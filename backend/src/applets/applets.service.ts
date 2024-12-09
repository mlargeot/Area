import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppletDto, AppletBodyDto, AppletModuleDto } from './dto/applets.dto';
import { User } from 'src/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid'
import { ActionsService } from 'src/actions/actions.service';

@Injectable()
export class AppletsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly actionsService : ActionsService
  ) {}

  async getApplets(): Promise<AppletDto[]> {
    return [];
  }

  async getAppletById(appletId: string): Promise<AppletDto> {
    return null;
  }

  async createApplet(userId: string, appletDto: AppletBodyDto): Promise<AppletDto> {

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
    };
  
    try {
      const actionResponse = await this.actionsService.executeAction(
        appletDto.action.name,
        appletDto.action.params,
      );
  
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

  async updateApplet(appletId: string, appletDto: AppletBodyDto): Promise<AppletDto> {
    return null;
  }

  async deleteApplet(appletId: string): Promise<boolean> {
    return false;
  }
}

import { Injectable } from '@nestjs/common';
import { AppletDto, AppletBodyDto } from './dto/applets.dto';

@Injectable()
export class AppletsService {
  constructor() {}

  async getApplets(): Promise<AppletDto[]> {
    return [];
  }

  async getAppletById(appletId: string): Promise<AppletDto> {
    return null;
  }

  async createApplet(userId: string, appletDto: AppletBodyDto): Promise<AppletDto> {
    return null;
  }

  async updateApplet(appletId: string, appletDto: AppletBodyDto): Promise<AppletDto> {
    return null;
  }

  async deleteApplet(appletId: string): Promise<boolean> {
    return false;
  }
}

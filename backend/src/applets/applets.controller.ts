import { Controller, Post, Param, Body, Patch, Delete, Get } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AppletsService } from './applets.service';
import { AppletDto, AppletBodyDto } from './dto/applets.dto';

@Controller('applets')
export class AppletsController {
  constructor(private readonly appletsService: AppletsService) {}

  @Get('')
  @ApiOkResponse({ description: 'Applets found.', type: [AppletDto] })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getApplets(): Promise<AppletDto[]> {
    return this.appletsService.getApplets();
  }

  @Get(':appletId')
  @ApiOkResponse({ description: 'Applet found.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Applet not found.' })
  async getApplet(@Param('appletId') appletId: string): Promise<AppletDto> {
    const applet = await this.appletsService.getAppletById(appletId);
    if (!applet) {
      throw new Error(`Applet with ID ${appletId} not found.`);
    }
    return applet;
  }

  @Post(':userId')
  @ApiCreatedResponse({ description: 'Applet created.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async createApplet(
    @Param('userId') userId: string,
    @Body() appletDto: AppletBodyDto,
  ): Promise<AppletDto> {
    return this.appletsService.createApplet(userId, appletDto);
  }

  @Patch(':appletId')
  @ApiOkResponse({ description: 'Applet updated.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Applet not found.' })
  async updateApplet(
    @Param('appletId') appletId: string,
    @Body() appletDto: AppletBodyDto,
  ): Promise<AppletDto> {
    const updatedApplet = await this.appletsService.updateApplet(appletId, appletDto);
    if (!updatedApplet) {
      throw new Error(`Applet with ID ${appletId} not found.`);
    }
    return updatedApplet;
  }

  @Delete(':appletId')
  @ApiOkResponse({ description: 'Applet deleted.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Applet not found.' })
  async deleteApplet(@Param('appletId') appletId: string): Promise<void> {
    const deleted = await this.appletsService.deleteApplet(appletId);
    if (!deleted) {
      throw new Error(`Applet with ID ${appletId} not found.`);
    }
  }
}

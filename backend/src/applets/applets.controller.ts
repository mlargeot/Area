import { Controller, Post, Param, Body, Patch, Delete, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { AppletsService } from './applets.service';
import { AppletDto, AppletBodyDto } from './dto/applets.dto';

@Controller('applets')
export class AppletsController {
  constructor(private readonly appletsService: AppletsService) {}

  @Get('')
  @ApiOkResponse({ description: 'Applets found.', type: [AppletDto] })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getApplets(): Promise<AppletDto[]> {
    return;
  }

  @Get(':appletId')
  @ApiOkResponse({ description: 'Applet found.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getApplet(): Promise<AppletDto> {
    return;
  }

  @Post(':userId')
  @ApiCreatedResponse({ description: 'Applet created.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async createApplet(
    @Param('userId') userId: string,
    @Body() appletDto: AppletBodyDto,
  ): Promise<AppletDto> {
    return;
  }

  @Patch(':appletId')
  @ApiOkResponse({ description: 'Applet updated.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Applet not found.' })
  async updateApplet(
    @Param('appletId') appletId: number,
    @Body() appletDto: AppletBodyDto,
  ): Promise<AppletDto> {
    return;
  }

  @Delete(':appletId')
  @ApiOkResponse({ description: 'Applet deleted.'})
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Applet not found.' })
  async deleteApplet(
    @Param('appletId') appletId: number,
  ) {
    return;
  }
}

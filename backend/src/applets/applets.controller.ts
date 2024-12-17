import {
  Controller,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Get,
  UseGuards,
  Req
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AppletsService } from './applets.service';
import { AppletDto, AppletBodyDto } from './dto/applets.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('applets')
export class AppletsController {
  constructor(private readonly appletsService: AppletsService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Applets found.', type: [AppletDto] })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getApplets(@Req() req): Promise<AppletDto[]> {
    return this.appletsService.getApplets(req.user.userId);
  }

  @Get(':appletId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Applet found.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Applet not found.' })
  async getApplet(
    @Req() req,
    @Param('appletId') appletId: string): Promise<AppletDto> {
    const applet = await this.appletsService.getAppletById(req.user.userId, appletId);
    if (!applet) {
      throw new Error(`Applet with ID ${appletId} not found.`);
    }
    return applet;
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ description: 'Applet created.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async createApplet(
    @Req() req,
    @Body() appletDto: AppletBodyDto,
  ): Promise<AppletDto> {
    return this.appletsService.createApplet(req.user.userId, appletDto);
  }

  @Patch(':appletId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Applet updated.', type: AppletDto })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Applet not found.' })
  async updateApplet(
    @Req() req,
    @Param('appletId') appletId: string,
    @Body() appletDto: AppletBodyDto,
  ): Promise<AppletDto> {
    const updatedApplet = await this.appletsService.updateApplet(req.user.userId, appletId, appletDto);
    if (!updatedApplet) {
      throw new Error(`Applet with ID ${appletId} not found.`);
    }
    return updatedApplet;
  }

  @Delete(':appletId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Applet deleted.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Applet not found.' })
  async deleteApplet(
    @Req() req,
    @Param('appletId') appletId: string): Promise<void> {
    const deleted = await this.appletsService.deleteApplet(req.user.userId, appletId);
    if (!deleted) {
      throw new Error(`Applet with ID ${appletId} not found.`);
    }
  }
}

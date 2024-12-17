import {
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';

const listServices = [
  { name: 'discord', color: '#5865F2', isActive: false },
  { name: 'spotify', color: '#1DB954', isActive: false },
  { name: 'twitch', color: '#9146FF', isActive: false },
  { name: 'x', color: '#1DA1F2', isActive: false },
  { name: 'google', color: '#FF0000', isActive: false },
  { name: 'github', color: '#333333', isActive: false },
];

const stateStore = new Map<string, { platform: string; redirect: string }>();

@Controller('services')
export class ServicesController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'List of services' })
  async listServices(@Req() req) {
    const userId = req.user.userId;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const userServices = listServices;
    user.oauthProviders.forEach((provider) => {
      const service = userServices.find((s) => s.name === provider.provider);
      if (service) {
        service.isActive = true;
      }
    });

    return listServices;
  }

  @Get('add/:service')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Add a services' })
  async addservice(@Req() req) {
    const userId = req.user.userId;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const service = req.params.service;
    const params = new URLSearchParams(window.location.search);
    const platform = params.get('platform');
    const redirect = params.get('redirect');

    if (!platform || !redirect) {
      throw new HttpException(
        'Missing platform or redirect parameter',
        HttpStatus.BAD_REQUEST,
      );
    }

    const state = randomBytes(16).toString('hex');
    stateStore.set(state, { platform, redirect });

    return 'authorized redirection soon';
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Test' })
  async test(@Req() req) {
    return 'test';
  }
}

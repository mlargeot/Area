import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  Redirect,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Provider,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBody, ApiForbiddenResponse, ApiResponse } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'node:crypto';
import { saveState, getState, deleteState } from './state.store';
import { ProvidersService } from './services/providers.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
  private providersService: ProvidersService,
) {}

  @Post('register')
  @ApiResponse({ status: 200, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('register');
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log('login');
    return this.authService.login(loginUserDto);
  }

  @Post('forgot-password')
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Protected resource' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBody({ type: CreateUserDto })
  async protectedResource(@Req() req) {
    console.log('protectedResource');
    const user: any = await this.authService.protectedResource(req.user);
    console.log(user);
    return user;
  }

  @Get('login/:provider')
  @ApiResponse({ status: 200, description: 'Service connected' })
  async loginProvider(@Param('provider') provider, @Req() req, @Res() res) {
    console.log('loginProvider');
    const redirect = req.query.redirect_uri;
    const state = crypto.randomUUID();
    saveState(state, { provider: provider, action: 'login', redirect });
    const providerUrl = this.providersService.loginProvider(provider, state);
    return res.redirect(providerUrl);
  }

  @Get('connect/:provider')
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Service connected' })
  async connectProvider(@Param('provider') provider, @Req() req) {
    console.log('connectProvider');
    const redirect = req.query.redirect_uri;
    const state = crypto.randomUUID();
    console.log(req.user);
    saveState(state, {
      provider: provider,
      action: 'connect',
      redirect,
      user_id: req.user.userId,
    });
    const providerUrl = this.providersService.loginProvider(provider, state);
    return { redirect_uri: providerUrl };
  }

  @Get('disconnect/:provider')
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Service connected' })
  async disconnectProvider(@Param('provider') provider, @Req() req) {
    console.log('disconnectProvider');
    await this.providersService.disconnectProvider(provider, req.user);
    return { message: 'Service disconnected' };
  }

  @Get('callback')
  @ApiResponse({ status: 200, description: 'Service connected' })
  @Redirect()
  async callback(@Query('code') code, @Query('state') state) {
    console.log('callback');

    const { provider, action, redirect, user_id } = getState(state);
    deleteState(state);

    switch (action) {
      case 'login':
        const token = await this.providersService.loginProviderCallback(
          provider,
          code,
        );
        return { url: `${redirect}?token=${token}` };
      case 'connect':
        await this.providersService.connectProviderCallback(provider, code, user_id);
        return { url: redirect };
      default:
        throw new HttpException('Invalid action', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('list-services')
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'List of connected services' })
  async listServices(@Req() req) {
    return this.providersService.listServices(req.user);
  }
}

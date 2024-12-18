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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 200, description: 'Registration successful' })
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
  @ApiBody({ type: CreateUserDto })
  async protectedResource(@Req() req) {
    console.log('protectedResource');
    const user: any = await this.authService.protectedResource(req.user);
    console.log(user);
    return user;
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiResponse({
    status: 200,
    description: 'Discord authentication successful',
  })
  @ApiBody({ type: CreateUserDto })
  async githubAuth(@Req() req) {
    console.log('githubdAuth');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiResponse({
    status: 200,
    description: 'Github authentication sucessful',
  })
  @ApiBody({ type: CreateUserDto })
  async githubAuthRedirect(@Req() req) {
    console.log('githubAuthRedirect');
    return this.authService.githubLogin(req.user);
  }

  @Post('login/:service')
  @ApiResponse({ status: 200, description: 'Service connected' })
  async loginService(@Body() { code }, @Param('service') service, @Req() req) {
    switch (service) {
      case 'google':
        return this.authService.logWithGoogle(code);
      case 'discord':
        return this.authService.logWithDiscord(code);
      default:
        throw new HttpException('Invalid service', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('unkink/:service')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Service disconnected' })
  async unlinkService(@Param('service') service, @Req() req) {
    // switch (service) {
    //   case 'google':
    //     return this.authService.unlinkGoogle(req.user);
    //   case 'discord':
    //     return this.authService.unlinkDiscord(req.user);
    //   case 'github':
    //     return this.authService.unlinkGithub(req.user);
    //   default:
    //     throw new HttpException('Invalid service', HttpStatus.BAD_REQUEST);
    // }
  }

  @Post('connect/:service')
  // @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Service connected' })
  async connectService(@Body() { code }, @Param('service') service, @Req() req) {
    switch (service) {
      case 'google':
        return this.authService.linkGoogle(code, req.user);
      case 'discord':
        return this.authService.linkDiscord(code, req.user);
      case 'github':
        return this.authService.linkGithub(code, req.user);
      default:
        throw new HttpException('Invalid service', HttpStatus.BAD_REQUEST);
    }

  }
}

import {Controller, Post, Body, Get, UseGuards, Req, Res} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  @ApiBody({ type: CreateUserDto })
  async googleAuth(@Req() req) {
    console.log('googleAuth');
    if (!req.user) {
      return null;
    }
    const state = this.authService.generateStateForUser(req.user);
    return state;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  @ApiBody({ type: CreateUserDto })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const state = req.query.state;
    console.log('googleAuthRedirect');
    const user: any = await this.authService.googleLogin(req.user, state);
    const token = user.token;
    res.redirect(`${process.env.FRONTEND_URL}/auth-handler?token=${token}`);
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  @ApiResponse({
    status: 200,
    description: 'Discord authentication successful',
  })
  @ApiBody({ type: CreateUserDto })
  async discordAuth(@Req() req) {
    console.log('discordAuth');
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  @ApiResponse({
    status: 200,
    description: 'Discord authentication successful',
  })
  @ApiBody({ type: CreateUserDto })
  async discordAuthRedirect(@Req() req) {
    console.log('discordAuthRedirect');
    const user: any = await this.authService.discordLogin(req.user);
    return user;
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Protected resource' })
  @ApiBody({ type: CreateUserDto })
  async protectedResource() {
    console.log('protectedResource');
    return 'Protected resource';
  }
}

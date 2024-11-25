import { Request, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('login')
  async login(@Request() req) {
    return req.body;
  }

  @Post('register')
  async register(@Request() req) {
    return req.body;
  }
}

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    console.log(email + ' ' + password);
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      return { message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      isGoogleUser: false,
    });

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return { message: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { message: 'Invalid password' };
    }

    const payload = { email: user.email, sub: user._id };
    console.log(email + ' logged in');
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(body: any) {
    const { email } = body;
    console.log(email + ' logged out');
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { message: 'User not found' };
    }

    return { message: 'Logged out' };
  }

  async googleLogin(user: any) {
    console.log('googleLogin');
    console.log(user);

    const { email, firstName, lastName, picture, accessToken } = user;
    let existingUser = await this.userModel.findOne({ email });

    if (!existingUser) {
      existingUser = await this.userModel.create({
        email,
        password: null,
        isGoogleUser: true,
        googleId: user.id,
      });
    }

    const payload = { email: existingUser.email, sub: existingUser._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async discordLogin(user: any) {
    console.log('discordLogin');
    console.log(user);

    const { email, firstName, lastName, picture, accessToken } = user;
    let existingUser = await this.userModel.findOne({ email });

    if (!existingUser) {
      existingUser = await this.userModel.create({
        email,
        password: null,
        isDiscordUser: true,
        discordId: user.id,
      });
    }

    const payload = { email: existingUser.email, sub: existingUser._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

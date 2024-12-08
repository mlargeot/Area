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

  generateStateForUser(user: any): string {
    if (!user) {
      return null;
    }
    const state = JSON.stringify({
      email: user.email,
      connectionMethod: user.connectionMethod,
      _id: user._id,
    });
    return state;
  }

  async findUserByState(state: string): Promise<any> {
    if (!state) {
      return null;
    }
    const { email, connectionMethod, id } = JSON.parse(state);
    const user = await this.userModel.findOne({
      email,
      connectionMethod,
      _id: id,
    });
    return user;
  }

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

  async googleLogin(user: any, state: any) {
    console.log('googleLogin');
    console.log(user);
    console.log(state);

    const userState = await this.findUserByState(state);

    const { email, firstName, lastName, picture, accessToken, refreshToken } =
      user;

    let existingUser;

    if (userState) {
      existingUser = await this.userModel.findOne({
        _id: userState._id,
      });
    }

    if (!existingUser) {
      existingUser = await this.userModel.create({
        email,
        password: null,
        connectionMethod: 'google',
        oauthProviders: [
          {
            provider: 'google',
            email,
            accessToken,
            refreshToken,
          },
        ],
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as nodemailer from 'nodemailer';

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
      connectionMethod: 'local',
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({
      email,
      connectionMethod: 'local',
    });

    if (!user) {
      return { message: 'User not found' };
    }

    const resetToken = this.jwtService.sign({
      email: user.email,
      _id: user._id,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'alexisdiabolo19@gmail.com',
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'alexisdiabolo19@gmail.com',
      to: email,
      subject: 'AR3M - Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password: \n\n ${resetUrl}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { message: 'Password reset email sent successfully!' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(resetPassword: ResetPasswordDto) {
    const { token, password } = resetPassword;
    const decoded = this.jwtService.verify(token);

    const user = await this.userModel.findOne({
      email: decoded.email,
      connectionMethod: 'local',
    });

    if (!user) {
      return { message: 'User not found' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password reset successful!' };
  }

  async googleLogin(user: any) {
    console.log('googleLogin');
    console.log(user);

    const { email, firstName, lastName, picture, accessToken, refreshToken } =
      user;
    let existingUser = await this.userModel.findOne({
      email,
      connectionMethod: 'google',
    });

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

    const { email, firstName, lastName, picture, accessToken, refreshToken } =
      user;
    let existingUser = await this.userModel.findOne({
      email,
      connectionMethod: 'discord',
    });

    if (!existingUser) {
      existingUser = await this.userModel.create({
        email,
        password: null,
        connectionMethod: 'discord',
        oauthProviders: [
          {
            provider: 'discord',
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
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
    * Register a new user
    * @param createUserDto - user data
    * @returns user
    */
  async protectedResource(tmpUser: any) {
    const user = await this.userModel.findOne({ _id: tmpUser.userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const { email, _id } = user;
    return { email, _id };
  }

  /**
    * Register a new user
    * @param createUserDto - user data
    * @returns user
    */
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      connectionMethod: 'local',
    });
    return user;
  }

  /**
    * Login a user
    * @param loginUserDto - user data
    * @returns access token
    */
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: user.email, sub: user._id };
    console.log(email + ' logged in');
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
    * Send a password reset email
    * @param forgotPasswordDto - user email
    * @returns success message
    */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({
      email,
      connectionMethod: 'local',
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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

  /**
    * Reset user password
    * @param resetPassword - token and new password
    * @returns success message
    */
  async resetPassword(resetPassword: ResetPasswordDto) {
    const { token, password } = resetPassword;
    const decoded = this.jwtService.verify(token);

    const user = await this.userModel.findOne({
      email: decoded.email,
      connectionMethod: 'local',
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return { message: 'Password reset successful!' };
  }
}

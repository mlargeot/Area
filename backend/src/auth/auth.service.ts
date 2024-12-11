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

  /**
   * Registers a new user.
   * @param createUserDto - Data transfer object containing user registration details.
   * @returns The created user.
   * @throws HttpException if the user already exists.
   */
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    console.log(email + ' ' + password);
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
   * Logs in a user.
   * @param loginUserDto - Data transfer object containing user login details.
   * @returns An object containing the access token.
   * @throws HttpException if the user is not found or the password is invalid.
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
   * Sends a password reset email.
   * @param forgotPasswordDto - Data transfer object containing the user's email address.
   * @returns An object containing a success message.
   * @throws HttpException if the user is not found or the email fails to send.
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
   * Resets a user's password.
   * @param resetPassword - Data transfer object containing the reset token and new password.
   * @returns An object containing a success message.
   * @throws HttpException if the user is not found.
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

  /**
   * Logs in a user using Google OAuth.
   * @param user
   * @returns An object containing the access token.
   * @throws HttpException if the user is not found.
   */
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

  /**
   * Logs in a user using GitHub OAuth.
   * @param user
   * @returns An object containing the access token.
   * @throws HttpException if the user is not found.
   */
  async githubLogin(user: any) {
    console.log('githubLogin');
    console.log(user);

    const { email, firstName, lastName, picture, githubId, accessToken } = user;
    let existingUser = await this.userModel.findOne({ email });

    if (!existingUser) {
      existingUser = await this.userModel.create({
        email,
        password: null,
        isGoogleUser: true,
        githubId: githubId,
      });
    }

    const payload = { email: existingUser.email, sub: existingUser._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

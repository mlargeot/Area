import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as base64url from 'base64url';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ReactionsGoogleService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService) {}

  async sendMail(userId: string, params: {mailSubject: string, mailContent: string})
  {
    const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

    const user = await this.userModel.findOne({ _id: userId });
    const googleProvider = user.oauthProviders?.find((provider) => provider.provider === 'google');
    if (!googleProvider || !googleProvider.accessToken)
        throw new UnauthorizedException(`Google access token not found for user with ID ${userId}.`);
    const googleAccessToken = googleProvider.accessToken; 

    const headers = { 
        Authorization: `Bearer ${googleAccessToken}`,
        'Content-Type': 'application/json'
    };
    try {
        const body = {
            raw: this.constructMail(params.mailSubject, params.mailContent)
        };
        const response = await firstValueFrom (
            this.httpService.post(url, body, { headers }),
        );
        console.log(`Mail sent successfully : ${response.data}`);
    } catch (error) {
        console.log(`Mail error : ${error.response?.data || error.message}`);
        throw new InternalServerErrorException(`Unexpected error occurs: ${error.response?.data || 
            error.message}`);
    }
  }

  async constructMail(mailSubject: string, mailContent: string)
  {
    try {
        const message = [
            `To: me`,
            `From: me`,
            `Subject: ${mailSubject}`,
            ``,
            mailContent,
        ].join('\r\n');
        return base64url.default.encode(Buffer.from(message, 'utf-8'));
    } catch (error) {
        throw new Error("Échec de lors de la création de l'e-mail");
    }
  }
}

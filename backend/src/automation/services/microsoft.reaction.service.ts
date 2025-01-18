import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as base64url from 'base64url';
import { firstValueFrom } from 'rxjs';
import { replacePlaceholders } from 'src/utils/string-utils';

@Injectable()
export class ReactionsMicrosoftService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService) {}

  async sendMail(userId: string, params: {mail_object: string, mail_message: string}, actionData: Record<string, any> = {}) {
    const url = 'https://graph.microsoft.com/v1.0/me/sendMail'; // Microsoft Graph API endpoint

    const user = await this.userModel.findOne({ _id: userId });
    const microsoftProvider = user.oauthProviders?.find((provider) => provider.provider === 'microsoft');
    if (!microsoftProvider || !microsoftProvider.accessToken) {
        throw new UnauthorizedException(`Microsoft access token not found for user with ID ${userId}.`);
    }
    const microsoftAccessToken = microsoftProvider.accessToken;

    const headers = {
        Authorization: `Bearer ${microsoftAccessToken}`,
        'Content-Type': 'application/json',
    };

    try {
        const messageEncoded = await this.constructMail(params.mail_object, params.mail_message, microsoftProvider.email);
        console.log(actionData);
        const message = replacePlaceholders(params.mail_message, actionData);
        const body = {
            message: {
                subject: params.mail_object,
                body: {
                    contentType: 'Text',
                    content: message
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: microsoftProvider.email
                        }
                    }
                ]
            }
        };

        console.log(`\nRESULT ENCODED: ${messageEncoded} ${params.mail_object} ${params.mail_message}\n`);
        const response = await firstValueFrom(
            this.httpService.post(url, body, { headers })
        );
        console.log(`Mail sent successfully: ${response.data}`);
    } catch (error) {
        console.error('Mail error:', error); // Log the full error object
        console.error('Error response data:', error.response?.data); // Log the response data if available
        console.error('Error message:', error.message); // Log the error message
        console.error('Error stack:', error.stack); // Log the error stack trace
        throw new InternalServerErrorException(
            `Unexpected error occurs: ${error.response?.data || error.message}`,
        );
    }
  }

  async constructMail(mailSubject: string, mailContent: string, mailer: string) {
    try {
        const message = [
            `To: ${mailer}`,
            `From: ${mailer}`,
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

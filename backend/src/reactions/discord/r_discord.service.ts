import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReactionsDiscordService {
  constructor(private readonly httpService: HttpService) {}

  async sendMessageToWebhook(params: {url: string; content: string})
  {
    const { url, content } = params;
    const payload = {
        content: content,
    }

    try {
        const response = await firstValueFrom (
            this.httpService.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        );
        console.log("Message sent successfully: ", response.data);
    } catch(error) {
        console.error('Error sending webhook message:', error.response?.data || error.message);
        throw error;
    }
  }
}

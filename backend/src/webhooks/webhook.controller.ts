import {
    Controller,
    Post,
    Req 
} from '@nestjs/common';
import { ApiOkResponse} from '@nestjs/swagger'
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(
        private readonly webhookService : WebhookService
    ) {}
  @Post('github/pr')
  @ApiOkResponse({ description: "Action triggered." })
  async triggerGitPREvent(@Req() req) {
    return this.webhookService.handlePREvent(req.body);
  }
}

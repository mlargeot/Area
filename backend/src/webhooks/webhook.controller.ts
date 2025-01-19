import {
    Controller,
    Get,
    Post,
    Req, 
    Res
} from '@nestjs/common';
import { ApiOkResponse} from '@nestjs/swagger'
import { WebhookService } from './webhook.service';
import { Response } from 'express';

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

  @Post('github/security')
  @ApiOkResponse({ description: "Action triggered." })
  async triggerGitSecurityEvent(@Req() req) {
    return this.webhookService.handleSecurityEvent(req.body);
  }

  @Post('github/push')
  @ApiOkResponse({ description: "Action triggered." })
  async triggerGitPushEvent(@Req() req) {
    return this.webhookService.handlePushEvent(req.body);
  }

  @Post('github/issues')
  @ApiOkResponse({ description: "Action triggered." })
  async triggerGitIssuesEvent(@Req() req) {
    return this.webhookService.handleIssuesEvent(req.body);
  }

  @Post('twitch/livestart')
  @ApiOkResponse({ description: "Live start triggered." })
  async triggerLiveStartEvent(@Req() req, @Res() res: Response) {
    if (req.headers['twitch-eventsub-message-type'] == "webhook_callback_verification") {
      const challengeResponse = await this.webhookService.handleChallengeCallback(req.body);
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(challengeResponse);
    } else {
      this.webhookService.handleLiveStart(req.body);
      return res.status(200).setHeader("Content-Type", 'application/json').send({result: "Live triggered"});
    }
  }

  @Get('starva/newactivity')
  @ApiOkResponse({ description: "Challenge triggered." })
  async triggerStravaChallenge(@Req() req, @Res() res: Response) {
    const challengeResponse = await this.webhookService.handleStravaChallenge(req.query);
    res.status(200).setHeader('Content-Type', 'application/json').send(challengeResponse);
  }

  @Post('strava/newactivity')
  @ApiOkResponse({ description: "Activity triggered." })
  async triggerStravaActivity(@Req() req, @Res() res: Response) {
    const response = await this.webhookService.handleStravaActivity(req.body);
    res.status(200).send(response);
  }
}

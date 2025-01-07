import { Injectable } from '@nestjs/common';
import { ActionsService } from 'src/automation/services/default.action.service';
import { ReactionsService } from 'src/automation/services/default.reaction.service';

@Injectable()
export class AboutService {
  constructor(
    private readonly actionServices: ActionsService,
    private readonly reactionsServices: ReactionsService
  ) {}

  async getFormatedAbout(clientIp: string)
  {
    const currentTime: number = Math.floor(Date.now() / 1000);
    const services = ["Google", "Discord", "Github", "Twitch", "Spotify", "Microsoft"];
    const actions = this.actionServices.getDefaultActions();
    const reactions = this.reactionsServices.getDefaultReactions();

    const servicesData = services.map((service: string) => {
      return {
        name: service,
        actions: this.getFormattedActions(actions, service),
        reactions: this.getFormattedReactions(reactions, service),
      };
    });

    const formatedAbout = {
      client: {
        host: clientIp,
      },
      server: {
        current_time: currentTime,
        services: servicesData,
      },
    };

    return formatedAbout;
  }

  private getFormattedActions(actions: any[], service: string) {
    return actions
      .filter(action => action.service === service)
      .flatMap(action => action.actions)
      .map(({ name, description }) => ({ name, description }));
  }

  private getFormattedReactions(reactions: any[], service: string) {
    return reactions
      .filter(reaction => reaction.service === service)
      .flatMap(reaction => reaction.reactions)
      .map(({ name, description }) => ({ name, description }));
  }
}

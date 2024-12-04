import { Injectable } from '@nestjs/common';
import { ActionsService } from '../actions/actions.service';
import { ActionsDto } from '../actions/dto/default_actions.dto';

@Injectable()
export class AboutService {
  constructor(private readonly actionServices: ActionsService) {}

  async getFormatedAbout(clientIp: string)
  {
    const currentTime: number = Math.floor(Date.now() / 1000);
    const services = ["google", "discord", "github", "twitch", "spotify", "microsoft"];
    const actions = this.actionServices.getDefaultActions();

    const servicesData = services.map((service: string) => {
      return {
        name: service,
        actions: this.getFormattedActions(actions, service),
        reactions: [], // Placeholder pour les réactions (à compléter après création des DTO)
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
}

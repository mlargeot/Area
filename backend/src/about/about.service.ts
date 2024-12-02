import { Injectable } from '@nestjs/common';

@Injectable()
export class AboutService {
  async getFormatedAbout(clientIp: string) {
    const currentTime: number = Math.floor(Date.now() / 1000);
    const services = ["google", "discord", "github", "twitch", "spotify", "microsoft"];

    const servicesData = services.map((service: string) => {
      return {
        name: service,
        actions: [], // Placeholder pour les actions (à compléter après création des DTO)
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
}

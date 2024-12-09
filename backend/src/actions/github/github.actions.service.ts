import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  async init_assign(email: string, body: Record<string, any>) {
    //TODO Remplacer email par unique ID ?
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('InitAssign: ${userID} not found.');
    }

    const repoUrl = body.githubRepoUrl
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(regex);
    if (!match)
      throw new BadRequestException('InitAssign: invalid github repository URL (e.g: https://github.com/owner/repository)')

    const data = {
      name: "web",
      config: {
        url: this.configService.get<string>('ASSIGN_ENDPOINT'),
        content_type: 'json',
      },
      events: ["pull_request"],
      active: true
    };

    //TODO: Get l'access Token Github avec les changements d'Alexis
    const headers = { Authorization: `Bearer ${this.configService.get<string>('TEMP_TOKEN')}`,
      accept: `application/vnd.github+json`
    }
    try {
      const response = await lastValueFrom(this.httpService.post(`https://api.github.com/repos/${match[1]}/${match[2]}/hooks`, data, { headers }));
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création du webhook : ${error.message}`);
    }
  }

  async triggerAssign() {
    console.log("PULL REQUEST IS TRIGGER!")
  }
}

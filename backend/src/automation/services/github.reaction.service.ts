import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReactionsGithubService {
  constructor(private readonly httpService: HttpService) {}

}

import { Controller, Get, Request } from '@nestjs/common';
import { GithubActionsService } from './github.actions.service';


@Controller()
export class GithubActionsController {
  constructor(private readonly GithubActionsService: GithubActionsService) {}

}

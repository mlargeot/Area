import { Controller, Get, Request } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppletsService } from './applets.service'


@Controller('applets')
export class AppletsController {
  constructor(private readonly AppletsService: AppletsService) {}
}

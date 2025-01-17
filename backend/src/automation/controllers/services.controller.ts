import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse} from '@nestjs/swagger'
import { ServicesService } from 'src/automation/services/services.service';
import { LogService } from '../../log/log.service';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly logService: LogService
  ) {}

  @Get()
  @ApiOkResponse({ description: "Services description found." })
  async getServices() {
    return this.servicesService.getServicesDescription();
  }

  @Get('logs/:userId')
  @ApiOkResponse({ description: "Logs found." })
  async getLogs(@Param('userId') userId: string) {
    return this.logService.getLogs(userId);
  }
}

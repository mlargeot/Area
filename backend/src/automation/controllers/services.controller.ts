import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse} from '@nestjs/swagger'
import { ServicesService } from 'src/automation/services/services.service';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  @Get()
  @ApiOkResponse({ description: "Services description found." })
  async getServices() {
    return this.servicesService.getServicesDescription();
  }
}

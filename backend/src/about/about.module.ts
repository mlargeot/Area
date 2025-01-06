import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AutomationModule } from 'src/automation/automation.module';

@Module({
  imports: [AutomationModule],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}

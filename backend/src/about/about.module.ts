import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { ActionsModule } from 'src/actions/actions.module';

@Module({
  imports: [ActionsModule],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}

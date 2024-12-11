import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { ActionsModule } from 'src/actions/actions.module';
import { ReactionsModule } from 'src/reactions/reactions.module';

@Module({
  imports: [ActionsModule, ReactionsModule],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}

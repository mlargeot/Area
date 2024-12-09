import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { GithubActionsModule } from './github/github.actions.module';

@Module({
    providers: [ActionsService],
    controllers: [ActionsController],
    imports: [GithubActionsModule],
    exports: [ActionsService]
})
export class ActionsModule {}

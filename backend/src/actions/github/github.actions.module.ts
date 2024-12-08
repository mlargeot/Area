import { Module } from '@nestjs/common';
import { GithubActionsController } from './github.actions.controller';
import { GithubActionsService } from './github.actions.service';

@Module({
    providers: [GithubActionsService],
    controllers: [GithubActionsController],
    imports: [],
    exports: [GithubActionsService]
})
export class GithubActionsModule {}

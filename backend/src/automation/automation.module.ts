import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {
    User,
    UserSchema
} from 'src/schemas/user.schema';
import { ActionsController } from 'src/automation/controllers/actions.controller';
import { ReactionsController } from 'src/automation/controllers/reactions.controller';
import { ActionsService } from 'src/automation/services/default.action.service';
import { GithubActionsService } from './services/github.action.service';
import { ReactionsService } from 'src/automation/services/default.reaction.service';
import { ReactionsDiscordService } from './services/discord.reaction.service';

@Module({
    providers: [
        ActionsService,
        GithubActionsService,
        ReactionsService,
        ReactionsDiscordService
    ],
    controllers: [
        ActionsController,
        ReactionsController
    ],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        HttpModule,
    ],
    exports: [
        ActionsService,
        ReactionsService
    ]
})
export class AutomationModule {}

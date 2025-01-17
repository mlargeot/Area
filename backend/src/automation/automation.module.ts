import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import {
    User,
    UserSchema
} from 'src/schemas/user.schema';
import { ActionsController } from 'src/automation/controllers/actions.controller';
import { ReactionsController } from 'src/automation/controllers/reactions.controller';
import { ServicesController } from 'src/automation/controllers/services.controller';
import { ActionsService } from 'src/automation/services/default.action.service';
import { GithubActionsService } from 'src/automation/services/github.action.service';
import { TwitchActionsService } from 'src/automation/services/twitch.action.service';
import { SpotifyAcitonsService } from 'src/automation/services/spotify.action.service';
import { ReactionsService } from 'src/automation/services/default.reaction.service';
import { ReactionsDiscordService } from 'src/automation/services/discord.reaction.service';
import { ReactionsGithubService } from 'src/automation/services/github.reaction.service';
import { ServicesService } from 'src/automation/services/services.service';
import { ReactionsGoogleService } from 'src/automation/services/google.reaction.service';
import { LeagueofLegendsActionsService } from './services/leagueoflegends.action.service';
import { OutlookActionsService } from './services/outlook.action.service';
import { LogModule } from 'src/logs/log.module';

@Module({
    providers: [
        ActionsService,
        GithubActionsService,
        SpotifyAcitonsService,
        LeagueofLegendsActionsService,
        OutlookActionsService,
        TwitchActionsService,
        ReactionsService,
        ReactionsDiscordService,
        ReactionsGoogleService,
        ReactionsGithubService,
        ServicesService,
    ],
    controllers: [
        ActionsController,
        ReactionsController,
        ServicesController,
    ],
    imports: [
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        HttpModule,
        LogModule,
    ],
    exports: [
        ActionsService,
        ReactionsService
    ]
})
export class AutomationModule {}

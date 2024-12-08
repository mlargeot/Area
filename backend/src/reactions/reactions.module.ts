import { Module } from '@nestjs/common';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { ReactionsDiscordModule } from './discord/r_discord.module';

@Module({
    providers: [ReactionsService],
    controllers: [ReactionsController],
    imports: [ReactionsDiscordModule],
    exports: [ReactionsService]
})
export class ReactionsModule {}

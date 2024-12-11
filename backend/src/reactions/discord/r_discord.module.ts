import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReactionsDiscordService } from './r_discord.service'

@Module({
    providers: [ReactionsDiscordService],
    imports: [HttpModule],
    exports: [ReactionsDiscordService]
})
export class ReactionsDiscordModule {}

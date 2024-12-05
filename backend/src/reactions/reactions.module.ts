import { Module } from '@nestjs/common';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';

@Module({
    providers: [ReactionsService],
    controllers: [ReactionsController],
    imports: [],
    exports: [ReactionsService]
})
export class ReactionsModule {}

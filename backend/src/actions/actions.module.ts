import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';

@Module({
    providers: [ActionsService],
    controllers: [ActionsController],
    imports: [],
    exports: [ActionsService]
})
export class ActionsModule {}

import { Module } from '@nestjs/common';
import { AppletsService } from './applets.service';
import { AppletsController } from './applets.controller';

@Module({
    providers: [AppletsService],
    controllers: [AppletsController],
    imports: [],
    exports: []
})
export class AppletsModule {}

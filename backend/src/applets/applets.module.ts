import { Module } from '@nestjs/common';
import { AppletsService } from './applets.service';
import { AppletsController } from './applets.controller';
import { ActionsModule } from 'src/actions/actions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';


@Module({
    providers: [AppletsService],
    controllers: [AppletsController],
    imports: [ActionsModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    exports: []
})
export class AppletsModule {}

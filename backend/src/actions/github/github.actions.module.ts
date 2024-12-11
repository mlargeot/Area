import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubActionsController } from './github.actions.controller';
import { GithubActionsService } from './github.actions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReactionsModule } from 'src/reactions/reactions.module';

@Module({
    providers: [GithubActionsService],
    controllers: [GithubActionsController],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        HttpModule,
        ReactionsModule
    ],    
    exports: [GithubActionsService]
})
export class GithubActionsModule {}

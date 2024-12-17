import { Module } from '@nestjs/common';
import { AppletsService } from './applets.service';
import { AppletsController } from './applets.controller';
import { AutomationModule } from 'src/automation/automation.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';


@Module({
    providers: [AppletsService],
    controllers: [AppletsController],
    imports: [
        AutomationModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ConfigModule.forRoot({isGlobal: true}),
    ],
    exports: []
})
export class AppletsModule {}

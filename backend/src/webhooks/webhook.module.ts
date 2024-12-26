import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookService } from 'src/webhooks/webhook.service'
import { WebhookController } from './webhook.controller';
import { AutomationModule } from 'src/automation/automation.module';
import {
    User,
    UserSchema
} from 'src/schemas/user.schema';

@Module({
    providers: [WebhookService],
    controllers: [WebhookController],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AutomationModule
    ],
    exports: []
})
export class WebhookModule {}

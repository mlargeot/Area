import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as mongoose from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ActionsModule } from './actions/actions.module';
import { ReactionsModule } from './reactions/reactions.module';

mongoose.set('debug', true);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URIDOCKER') ||
          configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AboutModule,
    ActionsModule,
    ReactionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

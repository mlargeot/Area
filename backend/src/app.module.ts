import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as mongoose from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module'
import { ActionsModule } from './actions/actions.module';

mongoose.set('debug', true);

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:secret@localhost:27017/ar3m-mongodb?authSource=admin',
    ),
    AuthModule,
    AboutModule,
    ActionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

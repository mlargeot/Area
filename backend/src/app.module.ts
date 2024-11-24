import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as mongoose from 'mongoose';

mongoose.set('debug', true);

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:secret@localhost:27017/ar3m-mongodb?authSource=admin',
    ), // updated connection string
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

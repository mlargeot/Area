import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from '../../schemas/log.schema';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(userId: string, name: string, status: string, details?: string): Promise<Log> {
    const log = new this.logModel({
      userId,
      name,
      status,
      timestamp: new Date(),
      details,
    });
    return log.save();
  }

  async getLogs(userId: string): Promise<Log[]> {
    return this.logModel.find({ userId }).exec();
  }

}
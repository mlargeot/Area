import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    const isConnected = this.connection.readyState === 1;
    console.log(
      `MongoDB connection status: ${isConnected ? 'Connected' : 'Disconnected'}`,
    );
  }

  getHello(): string {
    return 'Hello World!';
  }
}

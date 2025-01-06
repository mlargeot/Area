import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Applet, AppletSchema } from './applet.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: false })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop()
  connectionMethod: string;

  @Prop()
  oauthProviders: {
    provider: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    scope: string;
    accountId?: string;
  }[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: [AppletSchema], default: [] })
  applets: Applet[];
}

export const UserSchema = SchemaFactory.createForClass(User);

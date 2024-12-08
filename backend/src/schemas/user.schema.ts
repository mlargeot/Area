import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ default: false })
  isGoogleUser: boolean;

  @Prop()
  googleId?: string;

  @Prop({ required: false })
  isDiscordUser: boolean;

  @Prop()
  discordId?: string;

  @Prop()
  connectionMethod: string;

  @Prop()
  oauthProviders: {
    provider: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Applet, AppletSchema } from './applet.schema';

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

  @Prop({ type: [AppletSchema], default: [] })
  applets: Applet[];
}

export const UserSchema = SchemaFactory.createForClass(User);

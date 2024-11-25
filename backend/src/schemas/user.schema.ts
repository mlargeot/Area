import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false }) // Optional for Google OAuth users
  password?: string;

  @Prop({ default: false })
  isGoogleUser: boolean;

  @Prop()
  googleId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ForgotPasswordDocument = ForgotPassword & Document;

@Schema()
export class ForgotPassword {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;
}

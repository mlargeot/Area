import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Recoverable } from 'repl';

@Schema()
export class AppletModule {
  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, required: true })
  params: Record<string, any>;
}

@Schema()
export class Applet {
  @Prop({ required: true })
  appletId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: AppletModule, required: true })
  action: AppletModule;

  @Prop({ type: AppletModule, required: true })
  reaction: AppletModule;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: Object, required: false, default: {} })
  metadata: Record<string, any>;
}

export const AppletModuleSchema = SchemaFactory.createForClass(AppletModule);
export const AppletSchema = SchemaFactory.createForClass(Applet);

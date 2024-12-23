import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class Setting extends Document {
  @Prop({ required: true }) // Making fields required
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ type: Object, default: {} })
  value: any;

  @Prop()
  image: string;

  @Prop({ default: null })
  delete_at: Date | null;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class Status extends Document {
  @Prop({ required: true }) // Making fields required
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ type: Object, default: {} })
  color: any;

  @Prop({ default: null })
  delete_at: Date | null;
}

export const StatusSchema = SchemaFactory.createForClass(Status);

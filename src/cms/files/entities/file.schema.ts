import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
  @Prop({ default: null })
  destination: string;

  @Prop({ default: null })
  filename: string;

  @Prop({ default: null })
  filepath: string;

  @Prop({ default: null })
  mimeType:string

  @Prop({ default: null })
  size:string;

  @Prop({ default: null })
  module: string;

  @Prop({ default: null })
  public_id:string

  @Prop({ default: Date.now })
  create_at: Date;

  @Prop({ default: null })
  delete_at: Date | null;
}

export const FileSchema = SchemaFactory.createForClass(File);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class Scrap extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ default: 0 })
  quentity: number;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Catgory' })
  catagory: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'File' })
  gallery: MongooseSchema.Types.ObjectId[];

  @Prop()
  price: number;

  @Prop()
  image: string;

  // @Prop({ default: null })
  // delete_at: Date | null;
}

export const ScrapSchema = SchemaFactory.createForClass(Scrap);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class Category extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  short_name: string;

  @Prop({ default: null })
  type: string;

  @Prop({ required: true, default: null })
  slug: string;

  @Prop({ default: 0 })
  price: number

  @Prop({ default: null })
  description: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Catgory' })
  children: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Catgory', default: null })
  parent: MongooseSchema.Types.ObjectId;

  @Prop()
  image: string;

  // @Prop({ default: null })
  // delete_at: Date | null;
}

export const CatgorySchema = SchemaFactory.createForClass(Category);

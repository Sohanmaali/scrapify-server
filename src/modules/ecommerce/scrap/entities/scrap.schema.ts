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

  @Prop({ default: null })
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Catgory' })
  catagory: MongooseSchema.Types.ObjectId;

  @Prop({ default: null })
  description: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'File' })
  gallery: MongooseSchema.Types.ObjectId[];

  @Prop()
  price: number;

}

export const ScrapSchema = SchemaFactory.createForClass(Scrap);

ScrapSchema.pre('find', function (next) {
  this.populate('gallery');
  next();
});

ScrapSchema.pre('findOne', function (next) {
  this.populate('gallery');
  next();
});
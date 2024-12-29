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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'File' })
  featured_image: File;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Catgory' })
  children: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Catgory', default: null })
  parent: MongooseSchema.Types.ObjectId;

  @Prop()
  currency: string;
  
}

export const CatgorySchema = SchemaFactory.createForClass(Category);

// Populate 'featured_image' before 'find' and 'findOne' queries
CatgorySchema.pre('find', function (next) {
  this.populate('featured_image');
  next();
});

// Ensure populate works for `findOne` queries too
CatgorySchema.pre('findOne', function (next) {
  this.populate('featured_image');
  next();
});

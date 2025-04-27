import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  short_name: string;

  @Prop({ default: null })
  type: string;

  @Prop({ default: 'kg' })
  unit_type: string;

  @Prop({ required: true, default: null })
  slug: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: null })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'File' })
  featured_image: File;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Category' }) // Corrected
  children: MongooseSchema.Types.ObjectId[];
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', default: null }) // Corrected
  parent: MongooseSchema.Types.ObjectId;
  

  @Prop()
  currency: string;

  @Prop({ default: null, type: Date })
  delete_at: Date;
}

export const CatgorySchema = SchemaFactory.createForClass(Category);

// Populate 'featured_image' before 'find' and 'findOne' queries
CatgorySchema.pre('find', function (next) {
  this.populate('featured_image');
  this.populate('children');
  next();
});

// Ensure populate works for `findOne` queries too
CatgorySchema.pre('findOne', function (next) {
  this.populate('featured_image');
  this.populate('children');
  next();
});

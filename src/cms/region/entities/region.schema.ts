import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class Region extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  short_name: string;

  @Prop({ default: null })
  country_code: string;

  @Prop({ default: null })
  type: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Region' })
  children: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region', default: null })
  parent: MongooseSchema.Types.ObjectId;

  @Prop()
  image: string;
}

export const RegionSchema = SchemaFactory.createForClass(Region);

RegionSchema.pre('find', function (next) {
  this.populate('children');
  next();
});

// Ensure populate works for `findOne` queries too
RegionSchema.pre('findOne', function (next) {
  this.populate('children');
  next();
});


// Populate 'featured_image' before 'find' and 'findOne' queries
RegionSchema.pre('find', function (next) {
  this.populate('featured_image');
  next();
});

// Ensure populate works for `findOne` queries too
RegionSchema.pre('findOne', function (next) {
  this.populate('featured_image');
  next();
});

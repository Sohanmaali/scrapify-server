import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class SliderData {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'File', required: true }) // Reference to File schema
  image: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, }) // Simple string field
  heading: string;

  @Prop({ type: String, }) // Simple string field
  details: string;
}

const SliderDataSchema = SchemaFactory.createForClass(SliderData);

SliderDataSchema.pre('find', function (next) {
  this.populate('image');
  next();
})
SliderDataSchema.pre('findOne', function (next) {
  this.populate('image');
  next();
})

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class Slider extends Document {
  @Prop({ required: true }) // Making fields required
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ type: [SliderDataSchema], required: true }) // Define as an array of SliderDataSchema
  slider: SliderData[];

  @Prop({ default: null })
  type: string;

  @Prop({ default: null })
  delete_at: Date | null;
}

export const SliderSchema = SchemaFactory.createForClass(Slider);

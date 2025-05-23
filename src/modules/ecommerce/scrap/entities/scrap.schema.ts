import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import * as mongoosePaginate from 'mongoose-paginate-v2';
@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class Scrap extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: null })
  unit_type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: MongooseSchema.Types.ObjectId;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  total: number;

  @Prop({ default: null })
  mobile: string;

  @Prop({ default: null })
  alternate_mobile: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Status' })
  status: MongooseSchema.Types.ObjectId

  @Prop({ default: Date.now })
  available_date: Date

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'File' })
  gallery: MongooseSchema.Types.ObjectId[];

  @Prop()
  sell_price: number;

  // ================ADDRESS================

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  country: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  state: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  city: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  pincode: number


  @Prop({ default: null })
  delete_at: Date

}

export const ScrapSchema = SchemaFactory.createForClass(Scrap);

ScrapSchema.pre('find', function (next) {
  this.populate('gallery');
  this.populate('customer');
  this.populate('status');
  this.populate('country');
  this.populate('city');
  this.populate('state');
  this.populate('category');

  next();
});


ScrapSchema.pre('findOne', function (next) {
  this.populate('gallery');
  this.populate('customer');
  this.populate('status');
  this.populate('country');
  this.populate('city');
  this.populate('state');
  this.populate('category');
  next();
});


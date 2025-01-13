import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class Customer extends Document {
  @Prop({ required: true }) // Making fields required
  name: string;

  @Prop({ required: true, unique: true }) // Ensure unique email
  email: string;

  @Prop()
  otpExpiry: Date;

  @Prop()
  otp: string;

  @Prop({ default: null })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'File' })
  featured_image: File;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop()
  about_us: string;

  @Prop()
  gender: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  country: mongoose.Schema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  state: mongoose.Schema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  city: mongoose.Schema.Types.ObjectId;

  @Prop()
  address: string;

  @Prop()
  access_token: string; // Change to string if it's a JWT

  @Prop()
  refresh_token: string; // Change to string if it's a JWT

  @Prop({ default: null })
  delete_at: Date | null;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);


// CustomerSchema.methods.toJSON = function () {
//   const obj = this.toObject();

//   // delete obj.password; // Exclude password
//   delete obj.access_token; // Optionally exclude tokens
//   delete obj.refresh_token; // Optionally exclude tokens
//   delete obj.otp;
//   delete obj.otpExpiry;
//   return obj;
// };

CustomerSchema.pre('find', function (next) {
  this.populate('featured_image') 
  // this.populate("city")
  next();
});

CustomerSchema.pre('findOne', function (next) {
  this.populate('featured_image') 
  // this.populate("city")

  next();
});


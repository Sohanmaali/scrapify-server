// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Schema as MongooseSchema } from 'mongoose';

// @Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
// export class Customer extends Document {
//   @Prop({ required: true }) // Making fields required
//   name: string;

//   @Prop({ required: true, unique: true }) // Ensure unique email
//   email: string;

//   @Prop()
//   otpExpiry: Date;

//   @Prop()
//   otp: string;

//   @Prop({default: false})
//   isVerified: boolean;

//   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'File' })
//   featured_image: File;

//   @Prop()
//   password: string;

//   @Prop({ required: true, unique: true })
//   mobile: string;

//   @Prop()
//   role: string;

//   @Prop()
//   address: string;

//   @Prop()
//   access_token: string; // Change to string if it's a JWT

//   @Prop()
//   refresh_token: string; // Change to string if it's a JWT

//   @Prop()
//   image: string;

//   @Prop({ default: null })
//   delete_at: Date | null;
// }

// export const CustomerSchema = SchemaFactory.createForClass(Customer);

// CustomerSchema.pre('find', function (next) {
//  this.populate('featured_image');
//   next();
// });



import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'File' })
  featured_image: File;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop()
  role: string;

  @Prop()
  about_us: string;

  @Prop()
  gender: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  country: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  state: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Region' })
  city: string;

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

// Populate 'featured_image' before 'find' and 'findOne' queries
CustomerSchema.pre('find', function (next) {
  this.populate('featured_image');
  next();
});

// Ensure populate works for `findOne` queries too
CustomerSchema.pre('findOne', function (next) {
  this.populate('featured_image');
  next();
});

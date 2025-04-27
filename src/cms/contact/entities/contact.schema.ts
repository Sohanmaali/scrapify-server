import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Contact extends Document {

  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  email: string;

  @Prop({ default: null })
  mobile: string;

  @Prop({ default: null })
  message: string;

  @Prop({ default: null })
  delete_at: Date

}

export const ContactSchema = SchemaFactory.createForClass(Contact);

ContactSchema.pre('find', function (next) {

  next();
});


ContactSchema.pre('findOne', function (next) {

  next();
});


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Work extends Document {

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  employee: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Scrap' })
  scrap: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  assign_date: Date;

  @Prop({ default: null })
  delete_at: Date

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Admin' })
  admin: MongooseSchema.Types.ObjectId

}

export const WorkSchema = SchemaFactory.createForClass(Work);

WorkSchema.pre('find', function (next) {
this.populate('employee');
this.populate('scrap');

  next();
});


WorkSchema.pre('findOne', function (next) {
  this.populate('employee');
  this.populate('scrap');
  next();
});


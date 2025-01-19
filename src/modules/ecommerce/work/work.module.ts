import { Module } from '@nestjs/common';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSchema } from './entities/work.schema';
import { FileSchema } from '../../../cms/files/entities/file.schema';
import { CustomerSchema } from '../../authentication/customer/entities/customer.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Work', schema: WorkSchema },
    { name: 'File', schema: FileSchema },
    { name: 'Customer', schema: CustomerSchema }]),
  ],
  controllers: [WorkController],
  providers: [WorkService]
})
export class WorkModule { }

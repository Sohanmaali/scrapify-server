import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './entities/customer.schema';
import { FileSchema } from '../../../cms/files/entities/file.schema';
import { RegionSchema } from '../../../cms/region/entities/region.schema';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
// import * as multer from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
      { name: 'File', schema: FileSchema },
      { name: 'Region', schema: RegionSchema },
    ]),
    // MulterModule.register({
    //   dest: '/',
    // }),
    MulterModule.register({
      storage: multer.memoryStorage(), // Use memory storage
    }),
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule { }

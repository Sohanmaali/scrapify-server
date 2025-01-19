import { Module } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { ScrapController } from './scrap.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapSchema } from './entities/scrap.schema';
import { MulterModule } from '@nestjs/platform-express';
import { FileSchema } from '../../../cms/files/entities/file.schema';
import { MailHelper } from '../../../cms/helper/mail.helper';
import { FrontendScrapController } from './frontendScrap.controller';
import { CustomerSchema } from '../../authentication/customer/entities/customer.schema';
import { WorkSchema } from '../work/entities/work.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Scrap', schema: ScrapSchema },
      { name: 'File', schema: FileSchema },
      { name: 'Work', schema: WorkSchema },
      { name: 'Customer', schema: CustomerSchema }]),
    MulterModule.register({
      dest: '/',
    }),
  ],

  providers: [ScrapService, MailHelper],
  controllers: [ScrapController, FrontendScrapController]
})
export class ScrapModule { }

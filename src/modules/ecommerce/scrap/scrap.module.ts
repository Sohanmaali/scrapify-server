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
import multer from 'multer';
import { TaskManager, TaskManagerSchema } from '../task-manager/entities/tastManager.schema';
// import { TaskManagerService } from '../task-manager/TaskManager.service';
// import { TaskManager } from '../taskmanager/entities/taskmanger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Scrap', schema: ScrapSchema },
      { name: 'File', schema: FileSchema },
      { name: 'TaskManager', schema: TaskManagerSchema },
      { name: 'Customer', schema: CustomerSchema }
    ]),
    MulterModule.register({
      storage: multer.memoryStorage(), // Use memory storage
    }),
  ],

  providers: [ScrapService, MailHelper],
  controllers: [ScrapController, FrontendScrapController]
})
export class ScrapModule { }

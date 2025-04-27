import { Module } from '@nestjs/common';
import { TaskManagerService } from './TaskManager.service';
import { TaskManagerController } from './TaskManager.controller';
import { FrontendTaskManagerController } from './FrontendTaskManager';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskManagerSchema } from './entities/tastManager.schema';
import { MailHelper } from '../../../cms/helper/mail.helper';
@Module({

  imports: [
    MongooseModule.forFeature([
      { name: "TaskManager", schema: TaskManagerSchema },
     
    ]),

  ],

  providers: [TaskManagerService,MailHelper],
  controllers: [TaskManagerController, FrontendTaskManagerController]
})

export class TaskManagerModule { }

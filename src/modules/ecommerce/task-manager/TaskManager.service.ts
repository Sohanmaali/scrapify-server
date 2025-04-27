import { Injectable } from '@nestjs/common';
import { CmsHelper } from '../../../cms/helper/cmsHelper';
import { TaskManager } from './entities/tastManager.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailHelper } from '../../../cms/helper/mail.helper';
import { CustomPagination } from '../../../cms/helper/piplineHalper';
@Injectable()
export class TaskManagerService {


    constructor(
        private readonly mailHelper: MailHelper,
        @InjectModel(TaskManager.name) private taskManagerModel: Model<TaskManager>,
    ) { }
      async findAllTaskByUserId(req, query?) {
        return this.taskManagerModel.find();
      }
}

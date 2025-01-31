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
       console.log('========query=======',query);
       
        // const pipeline = [
        //   {
        //     $match: {delete_at:null},
        //   },
        //   {
        //     $sort: { createdAt: -1 }, 
        //   },
        //   {
        //     $lookup: {
        //       from: 'customers',
        //       localField: 'employee',
        //       foreignField: '_id',
        //       as: 'employee',
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: 'files',
        //       localField: 'employee.featured_image',
        //       foreignField: '_id',
        //       as: 'employee.featured_image',
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: 'scraps',
        //       localField: 'scrap',
        //       foreignField: '_id',
        //       as: 'scrap',
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: 'files',
        //       localField: 'scrap.gallery',
        //       foreignField: '_id',
        //       as: 'scrap.gallery',
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: 'regions',
        //       localField: 'scrap.country',
        //       foreignField: '_id',
        //       as: 'scrap.country',
        //     }
        //   },
        //   { $unwind: "$country" },
    
        //   {
        //     $lookup: {
        //       from: 'categories',
        //       localField: 'scrap.category',
        //       foreignField: '_id',
        //       as: 'scrap.category',
        //     }
        //   },
        //   { $unwind: "$category" },
    
        //   {
        //     $lookup: {
        //       from: 'customers',
        //       localField: 'customer',
        //       foreignField: '_id',
        //       as: 'customer',
        //     }
        //   },
        //   { $unwind: "$customer" },
    
        //   {
        //     $lookup: {
        //       from: 'status',
        //       localField: 'scrap.status',
        //       foreignField: '_id',
        //       as: 'scrap.status',
        //     }
        //   },
        //   { $unwind: "$status" },
    
    
        //   {
        //     $lookup: {
        //       from: 'regions',
        //       localField: 'state',
        //       foreignField: '_id',
        //       as: 'state',
        //     }
        //   },
        //   { $unwind: "$state" },
    
        //   {
        //     $lookup: {
        //       from: 'regions',
        //       localField: 'city',
        //       foreignField: '_id',
        //       as: 'city',
        //     }
        //   },
        //   { $unwind: "$city" },
    
        // ];
        // return await CustomPagination(req, pipeline, this.taskManagerModel);
     
     
        return this.taskManagerModel.find();
      }
}

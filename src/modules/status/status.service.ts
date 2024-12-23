import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Status } from './entities/status.schema';
import { Model } from 'mongoose';
import { CmsHelper } from '../../cms/helper/cmsHelper';
import { CustomPagination } from '../../cms/helper/piplineHalper';

@Injectable()
export class StatusService {
    
    constructor(
        @InjectModel('Status') private readonly statusModel: Model<Status>,
    ) { }

    async create(req) {
        return await CmsHelper.create(req, this.statusModel);
    }

    async findOne(req) {
        return await CmsHelper.findOne(req, this.statusModel);
    }

    async findAll(req, query?) {
        const pipeline = [
          {
            $match: query,
          },
          {
            $sort: { created_at: -1 },
          },
        ];
    
        return await CustomPagination(req, pipeline, this.statusModel);
      }

    async update(req) {
        return await CmsHelper.update(req, this.statusModel);
    }
    async delete(req) {
        return await CmsHelper.multiDelete(req, this.statusModel);
    }


}

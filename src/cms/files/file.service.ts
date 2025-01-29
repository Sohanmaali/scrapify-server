import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Borrowing } from './entities/borrowing.schema';

import { CmsHelper } from '../helper/cmsHelper';
import { File } from './entities/file.schema';
import { CustomPagination } from '../../cms/helper/piplineHalper';
// import Pipli

@Injectable()
export class FileService {
  constructor(@InjectModel('File') private readonly file: Model<File>) { }

  async create(req) {
    return await CmsHelper.create(req, this.file);
  }

  async getAll(req) {
    console.log('service');
    const query: any = { delete_at: null };
    const pipeline = [
      {
        $match: query,
      },
      {
        $sort: { create_at: -1 },
      },
    ];

    return await CustomPagination(req, pipeline, this.file);
  }

  async update(req) {
    return;
  }
}

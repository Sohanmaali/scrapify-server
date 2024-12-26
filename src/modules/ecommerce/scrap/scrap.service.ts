import { Injectable } from '@nestjs/common';
import { Scrap } from './entities/scrap.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomPagination } from '../../../cms/helper/piplineHalper';
import { CmsHelper } from '../../../cms/helper/cmsHelper';

@Injectable()
export class ScrapService {
 constructor(
    @InjectModel(Scrap.name) private scrapModel: Model<Scrap>,
  ) {}



     async getAll(req, query?) {
        const pipeline = [
          {
            $match: query,
          },
          {
            $sort: { created_at: -1 },
          },
        ];
    
        return await CustomPagination(req, pipeline, this.scrapModel);
      }
    
      async create(req) {
        const data = await CmsHelper.create(req, this.scrapModel);
        return data;
      }
    
      async findOne(req) {
        const id = req.params.id;
        const data = await CmsHelper.findOne(req, this.scrapModel);
        return data;
      }
    
      async findByType(req) {
        const data = await CmsHelper.findByType('mobile', req, this.scrapModel);
        return data;
      }
    
      async update(req) {
        const data = await CmsHelper.update(req, this.scrapModel);
        return data;
      }
    
      async search(req, query?) {
        console.log('----------->>>>>');
    
        const data = await CmsHelper.search(req, this.scrapModel);
        return data;
      }
}

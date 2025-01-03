import { Injectable } from '@nestjs/common';
import { Scrap } from './entities/scrap.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomPagination } from '../../../cms/helper/piplineHalper';
import { CmsHelper } from '../../../cms/helper/cmsHelper';
import { File } from '../../../cms/files/entities/file.schema';
import { MailHelper } from '../../../cms/helper/mail.helper';
import { Customer } from '../../authentication/customer/entities/customer.schema';

@Injectable()
export class ScrapService {
  constructor(
    private readonly mailHelper: MailHelper,
    @InjectModel(Scrap.name) private scrapModel: Model<Scrap>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(File.name) private fileModel: Model<File>,
  ) { }

  async getAll(req, query?) {
    const pipeline = [
      {
        $match: query,
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'gallery',
          foreignField: '_id',
          as: 'gallery',
        }
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'country',
          foreignField: '_id',
          as: 'country',
        }
      },
      { $unwind: "$country" },
      {
        $lookup: {
          from: 'regions',
          localField: 'state',
          foreignField: '_id',
          as: 'state',
        }
      },
      { $unwind: "$state" },

      {
        $lookup: {
          from: 'regions',
          localField: 'city',
          foreignField: '_id',
          as: 'city',
        }
      },
      { $unwind: "$city" },

    ];

    return await CustomPagination(req, pipeline, this.scrapModel);
  }

  


  async create(req) {

    const data = await CmsHelper.create(req, this.scrapModel, this.fileModel);

    const newData :any= await this.scrapModel.findOne({ _id: data._id }).lean();

    if (newData?.customer?.email) {
     await this.mailHelper.sendMailWithTemplate(newData?.customer?.email, "Request Send Successfully", "scrap-sell-req", newData);
    }

    return newData;
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
    const data = await CmsHelper.update(req, this.scrapModel, this.fileModel);
    return data;
  }




  async search(req, query?) {

    const data = await CmsHelper.search(req, this.scrapModel);
    return data;
  }
}

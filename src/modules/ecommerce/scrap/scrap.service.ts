import { Injectable } from '@nestjs/common';
import { Scrap } from './entities/scrap.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomPagination } from '../../../cms/helper/piplineHalper';
import { CmsHelper } from '../../../cms/helper/cmsHelper';
import { File } from '../../../cms/files/entities/file.schema';
import { MailHelper } from '../../../cms/helper/mail.helper';

@Injectable()
export class ScrapService {
  constructor(
    private readonly mailHelper: MailHelper,
    @InjectModel(Scrap.name) private scrapModel: Model<Scrap>,
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
    ];


    return await CustomPagination(req, pipeline, this.scrapModel);
  }

  async create(req) {
    // const subject = 'Welcome to Our Platform';
    // const context = {
    //   firstName: "sohn",  // dynamic value for firstName
    //   subject,    // dynamic value for subject
    //   year: new Date().getFullYear(),  // current year
    // };

    // return await this.mailHelper.sendMailWithTemplate("sohanmaali4@gmail.com", subject, 'welcome-email', context);

    const data = await CmsHelper.create(req, this.scrapModel, this.fileModel);
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
    const data = await CmsHelper.update(req, this.scrapModel, this.fileModel);
    return data;
  }




  async search(req, query?) {

    const data = await CmsHelper.search(req, this.scrapModel);
    return data;
  }
}

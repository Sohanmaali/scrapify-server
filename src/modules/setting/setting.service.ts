import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting } from './entities/setting.schema';
import { Model } from 'mongoose';
import { CmsHelper } from '../../cms/helper/cmsHelper';

@Injectable()
export class SettingService {

    constructor(
        @InjectModel('Setting') private readonly settingModel: Model<Setting>,
    ) { }

    // =================FOOTER SETTING========================

    async createOrUpdate(req,options?) {
        const filter = { name: req?.name }; // Filter based on unique field

        return await this.settingModel.findOneAndUpdate(filter, req, options);
      }
    async get(name)
    {
        return await this.settingModel.findOne({name:name})
    }
}

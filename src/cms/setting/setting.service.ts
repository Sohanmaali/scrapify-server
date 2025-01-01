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

    async createOrUpdate(req, options?) {
        const filter = { name: req?.name }; // Filter based on unique field

        return await this.settingModel.findOneAndUpdate(filter, req, options);
    }
    // async get(name)
    // {

    //     if (name==="browse-category") {

    //     }
    //     return await this.settingModel.findOne({name:name})
    // }
    async get(name: string) {
        if (name === "browse-category") {
            // Perform any specific logic here if needed
        }

        let data = await this.settingModel.findOne({ name: name }).exec();

        if (name === "browse-category") {
            data = await data.populate({
                path: 'value', // Field to populate
                model: 'Category', // The related model/schema
            });
        }
        return data
    }

}

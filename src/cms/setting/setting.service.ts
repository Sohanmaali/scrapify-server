import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting } from './entities/setting.schema';
import { Model } from 'mongoose';
import { CmsHelper } from '../../cms/helper/cmsHelper';
import { ImageUploadHelper } from '../helper/fileUploadHelper';
import { File } from '../files/entities/file.schema';

@Injectable()
export class SettingService {

    constructor(
        @InjectModel('Setting') private readonly settingModel: Model<Setting>,
        @InjectModel('File') private readonly fileModel: Model<File>,
    ) { }

    // =================FOOTER SETTING========================

    async createOrUpdate(req) {
        try {
            const options = { new: true, upsert: true };

            // Extract the new data from the request body
            const newData = { ...req?.body, name: req?.params?.id };

            const filter = { name: newData?.name };

            const updatedRecord = await this.settingModel.findOneAndUpdate(
                filter,
                newData,
                options,
            );

            return updatedRecord;
        } catch (error) {
            console.error('Error in createOrUpdate:', error);
            throw new Error(error.message);
        }
    }




    async get(req) {


        let data = null
        let query = {}


        data = await this.settingModel.findOne({ name: req?.params?.id }).exec();

        if (req?.params?.id === "browse-category" && data) {
            data = await data.populate({
                path: 'value', // Field to populate
                model: 'Category', // The related model/schema
            });
        }

        return data
    }

}

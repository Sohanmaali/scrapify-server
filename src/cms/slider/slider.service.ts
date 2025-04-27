import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Slider } from './entities/slider.schema';
import { Model } from 'mongoose';
import { CmsHelper } from '../helper/cmsHelper';
import { ImageUploadHelper } from '../helper/fileUploadHelper';
import { File } from '../files/entities/file.schema';
import { CustomPagination } from '../helper/piplineHalper';

@Injectable()
export class SliderService {

    constructor(
        @InjectModel('Slider') private readonly sliderModel: Model<Slider>,
        @InjectModel('File') private readonly fileModel: Model<File>,
    ) { }

    async create(req) {
        try {
            req.body.module = "Slider";
            return CmsHelper.create(req, this.sliderModel, this.fileModel)

        } catch (error) {
            console.error('Error in createOrUpdate:', error);
            throw new Error(error.message);
        }
    }


    async findAll(req) {
        const query = { delete_at: null }; // Filter to exclude deleted records

        const pipeline = [
            {
                $match: query, // Match documents where delete_at is null
            },
            {
                $unwind: '$slider', // Unwind the slider array
            },
            {
                $lookup: {
                    from: 'files', // Reference the 'files' collection
                    localField: 'slider.image', // Local field in SliderData
                    foreignField: '_id', // Foreign field in File schema
                    as: 'slider.image', // Populate the image field
                },
            },
            {
                $unwind: { path: '$slider.image', preserveNullAndEmptyArrays: true }, // Flatten image array
            },
            {
                $group: {
                    _id: '$_id', // Group back to the original structure
                    name: { $first: '$name' },
                    slug: { $first: '$slug' },
                    slider: { $push: '$slider' }, // Recreate the slider array
                    type: { $first: '$type' },
                    delete_at: { $first: '$delete_at' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                },
            },
        ];

        return await CustomPagination(req, pipeline, this.sliderModel);
    }


    async findOne(req) {

        const query = {
            $or: [
                { _id: req.params.id },
                { slug: req.params.id }
            ]
        }

        let data: any = await CmsHelper.findOne(req, this.sliderModel);

        if (data) {
            data = await data.populate({
                path: 'slider.image',
                model: 'File',
            });
        }
        return data
    }


    async update(req) {

        let data: any = await CmsHelper.update(req, this.sliderModel, this.fileModel);

        if (data) {
            data = await data.populate({
                path: 'slider.image',
                model: 'File',
            });
        }
        return data
    }
}

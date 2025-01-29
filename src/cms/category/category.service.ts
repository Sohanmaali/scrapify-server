import { Injectable } from '@nestjs/common';
import { CmsHelper } from '.././../cms/helper/cmsHelper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.schema';

import { CustomPagination } from '../../cms/helper/piplineHalper';
import { ensureUniqueSlug, generateSlug } from '../../cms/helper/slugHelper';
import { TreeHelper } from '../../cms/helper/TreeHelper';
import { File } from '../../cms/files/entities/file.schema';


@Injectable()
export class CategoryService {
    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        @InjectModel('File') private readonly fileModel: Model<File>,
    ) { }

    async findAll(req, query?) {
        const updatedquery = { ...query, delete_at: null, };

        const pipeline = [
            { $match: updatedquery },
            {
                $sort: { createdAt: -1 },
            },
            {
                $lookup: {
                    from: 'files',
                    localField: 'featured_image',
                    foreignField: '_id',
                    as: 'featured_image',
                },
            },
            {
                $unwind: {
                    path: '$featured_image',
                    preserveNullAndEmptyArrays: true, // this will ensure that if no image is found, it doesn't remove the document
                },
            },
        ];

        return await TreeHelper.findAllCategory(req, pipeline, this.categoryModel);
    }

    async findOne(req) {
        const data = await CmsHelper.findOne(req, this.categoryModel);

        return data

    }

    async update(req, query?) {
        return await TreeHelper.update(req, this.categoryModel, this.fileModel);
    }
    async delete(req) {
        return `This action removes a #${"id"} region`;
    }
    // async create(req, query?) {

    //     if (Array.isArray(req.body.name)) {
    //         const createdEntries = await Promise.all(
    //             req.body.name.map(async (name) => {
    //                 const data = { ...req.body, name }; 
    //                 return await CmsHelper.create({ body: data }, this.categoryModel);
    //             })
    //         );

    //         return createdEntries; // Return all created entries
    //     } else {
    //         // Handle the case where `name` is not an array
    //         return await CmsHelper.create(req, this.categoryModel);
    //     }
    // }

    async create(req, query?) {


        if (Array.isArray(req.body.name)) {
            const createdEntries = await Promise.all(
                req.body.name.map(async (name) => {

                    let slug = generateSlug(name);
                    slug = await ensureUniqueSlug(slug, this.categoryModel);

                    const data = { ...req.body, name, slug };
                    req.body.module = "Category";

                    const createdEntry = await CmsHelper.create({ body: data }, this.categoryModel);
                    if (req.body.parent) {
                        await this.categoryModel.updateMany(
                            { _id: req.body.parent },
                            { $push: { children: createdEntry._id } }
                        );
                    }

                    return createdEntry;
                })
            );


            return createdEntries; // Return all created entries
        } else {
            // Handle cases where `name` is not an array
            return await CmsHelper.create(req, this.categoryModel);
        }
    }


    async multiDelete(req, query?) {
        const data = await CmsHelper.multiDelete(req, this.categoryModel);
        return data;
    }


    async search(req, query?) {
        return await CmsHelper.search(req, this.categoryModel);
    }

}

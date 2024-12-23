import { Injectable } from '@nestjs/common';
import { CmsHelper } from '.././../cms/helper/cmsHelper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.schema';

import { CustomPagination } from '../../cms/helper/piplineHalper';
import { ensureUniqueSlug, generateSlug } from '../../cms/helper/slugHelper';


@Injectable()
export class CategoryService {
    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
    ) { }



    async findAll(req, query?) {
        const resolveChildren = async (parentItems) => {
            const populatedItems = await Promise.all(
                parentItems.map(async (item) => {
                    const children = await this.categoryModel
                        .find({ _id: { $in: item.children } }) // Find children based on IDs
                        .lean(); // Convert documents to plain objects

                    // Recursively resolve children of children
                    const populatedChildren = await resolveChildren(children);

                    // Attach resolved children back to the parent
                    return { ...item, children: populatedChildren };
                })
            );
            return populatedItems;
        };

        const initialRegions = await this.categoryModel.find(query).lean(); // Fetch top-level regions
        const data = await resolveChildren(initialRegions); // Recursively populate children
        return data;
    }

    async findOne(req) {
        return await CmsHelper.findOne(req, this.categoryModel);
    }

    async update(req) {
        return `This action updates a #${"id"} region`;
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

                    let slug = generateSlug(name); // Generate slug
                    slug = await ensureUniqueSlug(slug, this.categoryModel); // Ensure slug is unique


                    const data = { ...req.body, name, slug };


                    const createdEntry = await CmsHelper.create({ body: data }, this.categoryModel);
                       if (req.body.parent) {
                        await this.categoryModel.updateMany(
                            { _id: req.body.parent },
                            { $push: { children: createdEntry._id } } // Use $push to append the value to the array
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


}

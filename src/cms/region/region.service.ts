import { Injectable } from '@nestjs/common';
import { CmsHelper } from '../../cms/helper/cmsHelper';
import { InjectModel } from '@nestjs/mongoose';
import { Region } from './entities/region.schema';
import { Model } from 'mongoose';
import { CustomPagination } from '../../cms/helper/piplineHalper';
import { TreeHelper } from '../../cms/helper/TreeHelper';



@Injectable()
export class RegionService {

    constructor(
        @InjectModel('Region') private readonly regionModel: Model<Region>,
    ) { }


    // async findAll(req, query?) {
    //     const resolveChildren = async (parentItems) => {
    //         const populatedItems = await Promise.all(
    //             parentItems.map(async (item) => {
    //                 const children = await this.regionModel
    //                     .find({ _id: { $in: item.children } })
    //                     .lean();
    //                 const populatedChildren = await resolveChildren(children);

    //                 return { ...item, children: populatedChildren };
    //             })
    //         );
    //         return populatedItems;
    //     };

    //     const initialRegions = await this.regionModel.find(query).lean(); // Fetch top-level regions
    //     const data = await resolveChildren(initialRegions); // Recursively populate children

    //     return data;
    // }

    async findAll(req, query?) {

        const updatedquery = { ...query, delete_at: null, };

        const pipeline = [
            { $match: updatedquery },
        ];

        return await TreeHelper.findAll(req, pipeline, this.regionModel);

    }
    async findByType(req, query?) {

        const updatedquery = { ...query, delete_at: null, };

        const pipeline = [
            { $match: updatedquery },
        ];

        return await TreeHelper.findByType(req, pipeline, this.regionModel);

    }





    async findOne(req) {
        return await CmsHelper.findOne(req, this.regionModel);
    }

    async update(req) {
        return `This action updates a #${"id"} region`;
    }
    async delete(req) {
        return `This action removes a #${"id"} region`;
    }

    async create(req, query?) {
        if (Array.isArray(req.body.name)) {
            const createdEntries = await Promise.all(
                req.body.name.map(async (name) => {
                    const data = { ...req.body, name };

                    // Check if type is "state" during the creation
                    const createdEntry = await CmsHelper.create({ body: data }, this.regionModel);

                    // If type is "state", update children based on parentId
                    if (req.body.type === "state" || req.body.type === "city" && req.body.parent) {
                        await this.regionModel.updateMany(
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
            return await CmsHelper.create(req, this.regionModel);
        }
    }


    async multiDelete(req, query?) {
        const data = await CmsHelper.multiDelete(req, this.regionModel);
        return data;
    }


}

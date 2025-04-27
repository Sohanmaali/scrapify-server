import mongoose from 'mongoose';
import { ImageUploadHelper } from './CloudinaryHelper';

export class TreeHelper {
  constructor() {}

  static async findByType(req, pipeline = [], modal) {
    return await modal.aggregate(pipeline);
  }

  static async findAll(req, pipeline = [], modal) {
    pipeline.push({
      $lookup: {
        from: 'regions',
        localField: 'children',
        foreignField: '_id',
        as: 'children',
      },
    });

    return await modal.aggregate(pipeline);
  }

  // static async findAllCategory(req, pipeline = [], modal) {
  //   pipeline.push({
  //     $lookup: {
  //       from: 'categories',
  //       localField: 'children',
  //       foreignField: '_id',
  //       as: 'children',
  //     },
  //   });

  //   // Unwind the 'children' array
  //   pipeline.push({
  //     $unwind: {
  //       path: '$children',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   });

  //   // Lookup to populate 'featured_image' for each 'children'
  //   pipeline.push({
  //     $lookup: {
  //       from: 'files',
  //       localField: 'children.featured_image',
  //       foreignField: '_id',
  //       as: 'children.featured_image',
  //     },
  //   });

  //   // Unwind the 'featured_image' array
  //   pipeline.push({
  //     $unwind: {
  //       path: '$children.featured_image',
  //       preserveNullAndEmptyArrays: true, // Allows documents without featured images
  //     },
  //   });

  //   // Lookup to populate 'label' for each 'children' (new part)
  //   pipeline.push({
  //     $lookup: {
  //       from: 'labcategoriesels', // Assuming the collection is 'labels'
  //       localField: 'children.children', // Field in 'children' to join on
  //       foreignField: '_id', // Field in 'labels' to match
  //       as: 'children.children', // Field to store the result in 'children'
  //     },
  //   });

  //   // Unwind the 'label' field
  //   pipeline.push({
  //     $unwind: {
  //       path: '$children.children',
  //       preserveNullAndEmptyArrays: true, // Allows documents without labels
  //     },
  //   });

  //   // Group back 'children' to restore the array structure
  //   pipeline.push({
  //     $group: {
  //       _id: '$_id', // Group by the root document's _id
  //       root: { $first: '$$ROOT' }, // Preserve the root document
  //       children: { $push: '$children' }, // Collect children back into an array
  //     },
  //   });

  //   // Restore the root document structure
  //   pipeline.push({
  //     $replaceRoot: {
  //       newRoot: {
  //         $mergeObjects: ['$root', { children: '$children' }],
  //       },
  //     },
  //   });

  //   // Execute the aggregation pipeline
  //   return await modal.aggregate(pipeline);
  // }

  static async findAllCategory(req, pipeline = [], modal) {
    // You can add extra operations here, or use the same aggregation pipeline as needed
    return await modal.aggregate(pipeline);
  }

  static async update(req, model, fileModel?) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID');
      }

      if (data?.children) {
        if (typeof data.children === 'string') {
          data.children = data.children
            .split(',')
            .map((id) => new mongoose.Types.ObjectId(id));
        }
        if (data.children === '' || data.children === null) {
          data.children = [];
        }
      } else {
        data.children = [];
      }

      // Handle file upload if provided
      if (req?.file) {
        const uploadedImages = await ImageUploadHelper(req, fileModel);

        data.featured_image = uploadedImages;
      }

      console.log('-=-===-=-=-=11111111111=--=-=-', req?.files?.featured_image);

      if (req?.files?.featured_image && req?.files?.featured_image.length > 0) {
        const uploadedImages = await ImageUploadHelper(req, fileModel);
        console.log('-=-===-=-=-=uploadedImages=--=-=-', uploadedImages);

        data.featured_image = uploadedImages;
      }

      // Perform the update operation
      const updatedEntry = await model.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      });

      if (!updatedEntry) {
        throw new Error('Entry not found');
      }

      console.log('Entry updated:', updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Error updating entry:', error);
      throw new Error('Error updating entry');
    }
  }

  static async findOne(req, model) {}

  static async categoryCreate(req, model) {}
}

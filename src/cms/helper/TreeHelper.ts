import mongoose from "mongoose";


export class TreeHelper {
  constructor() { }


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
    },);

    return await modal.aggregate(pipeline);

  }

  // static async findAllCategory(req, pipeline = [], modal) {

  //     pipeline.push({
  //         $lookup: {
  //             from: 'categories',
  //             localField: 'children',
  //             foreignField: '_id',
  //             as: 'children',
  //         },
  //     },);

  //     return await modal.aggregate(pipeline);

  // }

  static async findAllCategory(req, pipeline = [], modal) {
    // Step 1: Populate the 'children' field by looking up the categories
    pipeline.push({
      $lookup: {
        from: 'categories', // The collection for categories
        localField: 'children', // The field in the current document
        foreignField: '_id', // The field in the 'categories' collection
        as: 'children', // The output field
      },
    });
  
    // Step 2: Unwind the 'children' array to process each child individually
    pipeline.push({
      $unwind: {
        path: '$children',
        preserveNullAndEmptyArrays: true, // Ensures documents without children are not excluded
      },
    });
  
    // Step 3: Populate 'featured_image' for each child category
    pipeline.push({
      $lookup: {
        from: 'files', // The collection for images/files
        localField: 'children.featured_image', // The field in the 'children' document
        foreignField: '_id', // The field in the 'files' collection
        as: 'children.featured_image', // The output field
      },
    });
  
    // Step 4: Unwind the 'featured_image' array (if required, as it may be an array)
    pipeline.push({
      $unwind: {
        path: '$children.featured_image',
        preserveNullAndEmptyArrays: true, // Allows documents without featured images
      },
    });
  
    // Step 5: Group back 'children' to restore the array structure
    pipeline.push({
      $group: {
        _id: '$_id', // Group by the root document's _id
        root: { $first: '$$ROOT' }, // Preserve the root document
        children: { $push: '$children' }, // Collect children back into an array
      },
    });
  
    // Step 6: Restore the root document structure
    pipeline.push({
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$root', { children: '$children' }],
        },
      },
    });
  
    // Execute the aggregation pipeline
    return await modal.aggregate(pipeline);
  }
  





  static async update(req, model, fileModel?) {
    try {
      const { id } = req.params;
      const data = req.body;

      // Check if the ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID');
      }

      // Check if 'children' is provided, and if it is a string, convert it to an array of ObjectId
      if (data?.children) {
        if (typeof data.children === 'string') {
          // If 'children' is a string, split it by commas and convert to ObjectId
          data.children = data.children.split(',').map(id => new mongoose.Types.ObjectId(id));
        }
        // If 'children' is an empty string or null, set it to an empty array
        if (data.children === "" || data.children === null) {
          data.children = [];
        }
      } else {
        // If no 'children' provided, ensure it's an empty array
        data.children = [];
      }

      // Handle file upload if provided
      if (req?.file) {
        const filePath = req?.file?.path;
        const relativeFilePath = filePath.replace(process.cwd() + '\\public', '');
        const imageData = {
          destination: req?.file?.destination,
          filename: req?.file?.filename,
          filepath: relativeFilePath,
        };

        const fileData = await fileModel.create(imageData);
        if (fileData) {
          data.featured_image = fileData._id;
        }
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

  static async findOne(req, model) {
  }
  

}  
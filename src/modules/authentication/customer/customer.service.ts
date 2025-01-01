import { Injectable, Res } from '@nestjs/common';
import { Customer } from './entities/customer.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CustomPagination } from '../../../cms/helper/piplineHalper';
import { CmsHelper } from '../../../cms/helper/cmsHelper';
import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';
import { File } from '../../../cms/files/entities/file.schema';
import { ImageUploadHelper } from '../../../cms/helper/fileUploadHelper';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(File.name) private fileModel: Model<File>,

  ) { }

  async validateCustomer(email: string, password: string): Promise<any> {
    const customer = await this.customerModel.findOne({ email }).exec();
    if (customer && (await bcrypt.compare(password, customer.password))) {
      return customer;
    }
    return null;
  }

  async getAll(req, query?) {
    const pipeline = [
      {
        $match: query,
      },
      {
        $sort: { created_at: -1 },
      },
    ];

    return await CustomPagination(req, pipeline, this.customerModel);
  }

  async create(req) {


    const data = await this.customerModel.create(req);
    return data;
  }

  async findOne(req) {
    const id = req.params.id;
    const data = await CmsHelper.findOne(req, this.customerModel);
    return data;
  }

  async findByType(req) {
    const data = await CmsHelper.findByType('mobile', req, this.customerModel);
    return data;
  }

  async update(req: any) {
    try {

      if (!req._id) {
        throw new Error('_id is required for update operation');
      }

      const filter = { _id: req._id };
      const update = { ...req };
      delete update._id; // Remove _id from the update object

      const options = { new: true, runValidators: true };

      const updatedData = await this.customerModel.findOneAndUpdate(filter, update, options);

      if (!updatedData) {
        throw new Error('No document found with the given _id');
      }



      return updatedData;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }
  async updateProfile(req) {
    const filter = { _id: req.auth?._id };
    const update = { ...req.body };
    console.log("-=-=-=-==-update", req.body);

    delete update._id; // Remove _id from the update object
    const options = { new: true, runValidators: true };
    if (update?.featured_image && typeof update?.featured_image === "string") {
      try {
          update.featured_image = JSON.parse(update.featured_image);
      } catch (err) {
          console.error("Error parsing featured_image:", err.message);
          // throw new Error("Invalid JSON format for featured_image");
      }
  }
    // Check if delete_at is null
    if (update.delete_at === 'null') {
      update.delete_at = null;
    }



    if (req?.file) {

      console.log("=-=-=-=-==-==--==re", req?.file);

      const uploadedImages = await ImageUploadHelper(req, this.fileModel);

      if (uploadedImages) {

        update.featured_image = uploadedImages;
      }

    }

    // Perform the update operation
    const updatedData = await this.customerModel.findOneAndUpdate(filter, update, options);

    // Returning the updated data (you may want to modify this)
    return updatedData;
  }


  async search(req, query?) {

    const data = await CmsHelper.search(req, this.customerModel);
    return data;
  }


  async getProfile(req) {

    return this.customerModel.findOne({ _id: req.auth._id })

    // return
  }
}

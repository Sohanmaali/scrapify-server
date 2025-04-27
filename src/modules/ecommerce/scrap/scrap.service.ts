import { Injectable } from '@nestjs/common';
import { Scrap } from './entities/scrap.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CustomPagination } from '../../../cms/helper/piplineHalper';
import { CmsHelper } from '../../../cms/helper/cmsHelper';
import { File } from '../../../cms/files/entities/file.schema';
import { MailHelper } from '../../../cms/helper/mail.helper';
import { Customer } from '../../authentication/customer/entities/customer.schema';

import { ImageUploadHelper } from '../../../cms/helper/CloudinaryHelper';
import { TaskManager } from '../task-manager/entities/tastManager.schema';

@Injectable()
export class ScrapService {
  constructor(
    private readonly mailHelper: MailHelper,
    @InjectModel(Scrap.name) private scrapModel: Model<Scrap>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(TaskManager.name) private taskManagerModel: Model<TaskManager>,
    @InjectModel(File.name) private fileModel: Model<File>,
  ) {}

  async getAll(req, query?) {
    const pipeline = [
      {
        $match: query,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'gallery',
          foreignField: '_id',
          as: 'gallery',
        },
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'country',
          foreignField: '_id',
          as: 'country',
        },
      },
      { $unwind: '$country' },

      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'catagory',
        },
      },
      { $unwind: '$catagory' },

      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },

      {
        $lookup: {
          from: 'status',
          localField: 'status',
          foreignField: '_id',
          as: 'status',
        },
      },
      { $unwind: '$status' },

      {
        $lookup: {
          from: 'regions',
          localField: 'state',
          foreignField: '_id',
          as: 'state',
        },
      },
      { $unwind: '$state' },

      {
        $lookup: {
          from: 'regions',
          localField: 'city',
          foreignField: '_id',
          as: 'city',
        },
      },
      { $unwind: '$city' },
    ];

    return await CustomPagination(req, pipeline, this.scrapModel);
  }
  async getAssion(req, query?) {
    const pipeline = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'files',
          localField: 'gallery',
          foreignField: '_id',
          as: 'gallery',
        },
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'country',
          foreignField: '_id',
          as: 'country',
        },
      },
      { $unwind: '$country' },

      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'catagory',
        },
      },
      { $unwind: '$catagory' },
      {
        $lookup: {
          from: 'status',
          localField: 'status',
          foreignField: '_id',
          as: 'status',
        },
      },
      { $unwind: '$status' },

      {
        $lookup: {
          from: 'regions',
          localField: 'state',
          foreignField: '_id',
          as: 'state',
        },
      },
      { $unwind: '$state' },

      {
        $lookup: {
          from: 'regions',
          localField: 'city',
          foreignField: '_id',
          as: 'city',
        },
      },
      { $unwind: '$city' },
    ];

    return await CustomPagination(req, pipeline, this.scrapModel);
  }

  async getTrash(req, query?) {
    const pipeline = [
      {
        $match: query,
      },
      {
        $sort: { created_at: -1 },
      },
    ];

    return await CustomPagination(req, pipeline, this.scrapModel);
  }

  async create(req) {
    req.body.status = process.env.PENDING_STATUS_ID;
    req.body.module = 'scrap';
    const data = await CmsHelper.create(req, this.scrapModel, this.fileModel);

    const newData: any = await this.scrapModel
      .findOne({ _id: data._id })
      .lean();

    if (newData?.customer?.email) {
      await this.mailHelper.sendMail(
        newData?.customer?.email,
        'Request Send Successfully',
        'scrap-sell-req',
        newData,
      );
    }
    await this.mailHelper.sendMail(
      process.env.ADMIN_EMAIL,
      `${newData?.customer?.name} Send Request For Scrap Sell`,
      'scrap-sell-req',
      newData,
    );

    return newData;
  }

  async findOne(req) {
    const id = req.params.id;
    const data = await CmsHelper.findOne(req, this.scrapModel);
    return data;
  }

  async findByType(req) {
    const data = await CmsHelper.findByType('mobile', req, this.scrapModel);
    return data;
  }

  async update(req) {
    if (req.query.assign === 'assign_work') {
      this.taskManagerModel.create({
        employee: new mongoose.Types.ObjectId(req.body.employee),
        scrap: new mongoose.Types.ObjectId(req.body._id),
        status: req.body.status,
        admin: new mongoose.Types.ObjectId(req?.auth?._id),
        assign_date: new Date(),
      });
    }

    const data = await CmsHelper.update(req, this.scrapModel, this.fileModel);
    if (req.body.status === process.env.ACCEPT_STATUS_ID) {
      console.log('mail');
    }
    return data;
  }

  async search(req, query?) {
    const data = await CmsHelper.search(req, this.scrapModel);
    return data;
  }
  async multiTrash(req) {
    const data = await CmsHelper.multiTrash(req, this.scrapModel);
    return data;
  }

  async multiRestore(req, query?) {
    const data = await CmsHelper.multiRestore(req, this.scrapModel);
    return data;
  }

  async multiDelete(req, query?) {
    const data = await CmsHelper.multiDelete(req, this.scrapModel);
    return data;
  }

  async upload(req) {
    try {
      const uploadResults = {};

      // Handle single file for featured_image
      if (req.files?.featured_image?.length) {
        const uploadedFeaturedImage = await ImageUploadHelper(
          req,
          this.fileModel,
        );
        uploadResults['featured_image'] = uploadedFeaturedImage;
      }

      // Handle multiple files for gallery
      if (req.files?.gallery?.length) {
        const galleryPaths = req.files.gallery.map((file) => file.path); // Extract paths
        const uploadedGallery = ImageUploadHelper(req, this.fileModel);

        uploadResults['gallery'] = uploadedGallery;
      }

      // Save to Scrap model or return upload results
      const scrapData = {
        featured_image: uploadResults['featured_image'],
        gallery: uploadResults['gallery'] || [],
        created_at: new Date(),
      };

      return {
        message: 'Files uploaded successfully',
        data: { scrapData },
      };
    } catch (error) {
      console.error('Error uploading files:', error.message);
      throw new Error('Failed to upload files. Please try again.');
    }
  }
}

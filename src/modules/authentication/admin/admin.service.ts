import { Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CustomPagination } from '../../../cms/helper/piplineHalper';
import { CmsHelper } from '../../../cms/helper/cmsHelper';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.adminModel.findOne({ email }).exec();
    if (admin && (await bcrypt.compare(password, admin.password))) {
      return admin;
    }
    return null;

    
  }

  async create(req) {
    // Extract the password from the request
    const { password, ...rest } = req.body;

    // Encrypt the password
    const saltRounds = 10; // Higher rounds make it more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Update the request body with the hashed password
    req.body = {
      ...rest,
      password: hashedPassword,
    };

    // Store the encrypted password and other fields in the database
    return await this.adminModel.create(req);
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

    return await CustomPagination(req, pipeline, this.adminModel);
  }

  async findOne(req) {
    const id = req.params.id;
    const data = await CmsHelper.findOne(req, this.adminModel);
    return data;
  }

  async update(req) {
    const data = await CmsHelper.update(req, this.adminModel);
    return data;
  }
}

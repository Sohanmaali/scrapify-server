import { Injectable } from '@nestjs/common';
import { Customer } from './entities/customer.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CustomPagination } from '../../../cms/helper/piplineHalper';
import { CmsHelper } from '../../../cms/helper/cmsHelper';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

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

    console.log("-=-===-=-===req",req);
    
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

  async update(req) {
    const data = await CmsHelper.update(req, this.customerModel);
    return data;
  }

  async search(req, query?) {
    console.log('----------->>>>>');

    const data = await CmsHelper.search(req, this.customerModel);
    return data;
  }
}

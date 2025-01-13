import { Injectable } from '@nestjs/common';
// import { Customer } from '../../authentication/customer/entities/customer.schema';
// import { Bill } from '../../aok/bill/entities/bill.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Customer } from '../authentication/customer/entities/customer.schema';
import { Scrap } from '../ecommerce/scrap/entities/scrap.schema';
// import { CustomPagination } from '../../../cms/helper/piplineHalper';
// import { CmsHelper } from '../../../cms/helper/cmsHelper';
// import { Customer } from './Customer.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Scrap.name) private scrapModel: Model<Scrap>,

  ) { }

  async getDashboardCounting(req) {
    const customerCount = await this.customerModel.countDocuments();
    const scrapCount = await this.scrapModel.countDocuments();

    // return this.customerModel.countDocuments();

    return { customerCount: customerCount,scrapCount: scrapCount };
    // return data;
  }
}

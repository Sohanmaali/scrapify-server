import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../authentication/customer/entities/customer.schema';
import { Scrap } from '../ecommerce/scrap/entities/scrap.schema';
import { Category } from '../../cms/category/entities/category.schema';
import { CmsHelper } from '../../cms/helper/cmsHelper';
import { Contact } from '../../cms/contact/entities/contact.schema';


@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Scrap.name) private scrapModel: Model<Scrap>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,

  ) { }

  async getDashboardCounting(req) {
    const customerCount = await this.customerModel.countDocuments();
    const scrapCount = await this.scrapModel.countDocuments();
    const contactCount = await this.contactModel.countDocuments();
    return { customerCount: customerCount, scrapCount: scrapCount, contactCount };

  }
  async globalSearch(req) {

    const categoryResults = await CmsHelper.search(req, this.categoryModel)

    const formattedResults = [
      { data: [...categoryResults], type: 'category' },
    ];

    return formattedResults;
  }

}

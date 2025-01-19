import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
// import { MailHelper } from '../../../cms/helper/mail.helper';
import { Work } from './entities/work.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../../authentication/customer/entities/customer.schema';
import { File } from '../../../cms/files/entities/file.schema';
import { CmsHelper } from '../../../cms/helper/cmsHelper';


@Injectable()
export class WorkService {

    constructor(
        // private readonly mailHelper: MailHelper,
        @InjectModel(Work.name) private scrapModel: Model<Work>,
        @InjectModel(Customer.name) private customerModel: Model<Customer>,
        @InjectModel(File.name) private fileModel: Model<File>,
    ) { }

    async create(req) {
        const data = await CmsHelper.create(req, this.scrapModel, this.fileModel);
        return data;
    }
}

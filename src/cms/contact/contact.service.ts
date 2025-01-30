import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './entities/contact.schema';
import { CmsHelper } from '../helper/cmsHelper';
import { MailHelper } from '../helper/mail.helper';
import { CustomPagination } from '../helper/piplineHalper';

@Injectable()
export class ContactService {

    constructor(
        private readonly mailHelper: MailHelper,

        @InjectModel('Contact') private readonly contactModel: Model<Contact>,
    ) { }


    async create(req) {
        const data = await CmsHelper.create(req, this.contactModel);

        const plainData = data.toObject ? data.toObject() : data; // Convert if it's a Mongoose document
        await this.mailHelper.sendMail(process.env.ADMIN_EMAIL, "Your Contact Inquiry", "contact-Inquiry", plainData);

        return data;
    }

    async findAll(req, query?) {
        const pipeline = [
            {
                $match: query,
            },
        ]

        return await CustomPagination(req, pipeline, this.contactModel);

    }
    async search(req, query?) {

        const data = await CmsHelper.search(req, this.contactModel, query);
        return data;
    }

    async multiDelete(req, query?) {
        const data = await CmsHelper.multiDelete(req, this.contactModel);
        return data;
    }
}

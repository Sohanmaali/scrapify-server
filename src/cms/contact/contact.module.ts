import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ContactSchema } from './entities/contact.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailHelper } from '../helper/mail.helper';
import { FrontdendContactController } from './FrontdendContact.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }]), // Registering the Admin model
  ],
  providers: [ContactService, MailHelper],
  controllers: [ContactController,FrontdendContactController]
})
export class ContactModule { }

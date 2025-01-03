import { Module } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { EcommerceController } from './ecommerce.controller';
import { ScrapModule } from './scrap/scrap.module';
import { MailHelper } from '../../cms/helper/mail.helper';

@Module({
  // providers: [EcommerceService],
  providers: [EcommerceService,MailHelper],
  controllers: [EcommerceController],
  imports: [ScrapModule]
})
export class EcommerceModule {}

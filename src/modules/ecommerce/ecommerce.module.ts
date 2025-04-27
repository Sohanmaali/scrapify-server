import { Module } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { EcommerceController } from './ecommerce.controller';
import { ScrapModule } from './scrap/scrap.module';
import { MailHelper } from '../../cms/helper/mail.helper';
// import { TaskManagerModule } from './taskmanager/taskmanager.module';
// import { TaskManagerModule } from './work/taskmanager.module';
import { TaskManagerModule } from './task-manager/TaskManager.module';

@Module({
  // providers: [EcommerceService],
  providers: [EcommerceService,MailHelper],
  controllers: [EcommerceController],
  imports: [ScrapModule, TaskManagerModule, ]
})
export class EcommerceModule {}

import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from '../authentication/customer/entities/customer.schema';
import { ScrapSchema } from '../ecommerce/scrap/entities/scrap.schema';
import { FrontendDashboardController } from './frontendDashboard.controller';
import { CatgorySchema } from '../../cms/category/entities/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Scrap', schema: ScrapSchema },
      { name: 'Category', schema: CatgorySchema }

    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController, FrontendDashboardController],
  exports: [DashboardService],
})
export class DashboardModule { }

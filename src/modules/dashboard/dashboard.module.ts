import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from '../authentication/customer/entities/customer.schema';
import { ScrapSchema } from '../ecommerce/scrap/entities/scrap.schema';
// import { BillSchema } from '../bill/entities/bill.schema';
// import { Customer, CustomerSchema } from './entities/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Scrap', schema: ScrapSchema }

    ]), // Registering the Customer model
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService], // Export CustomerService if needed in other modules
})
export class DashboardModule { }

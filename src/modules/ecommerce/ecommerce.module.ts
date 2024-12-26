import { Module } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { EcommerceController } from './ecommerce.controller';
import { ScrapModule } from './scrap/scrap.module';

@Module({
  providers: [EcommerceService],
  controllers: [EcommerceController],
  imports: [ScrapModule]
})
export class EcommerceModule {}

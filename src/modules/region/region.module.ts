import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionSchema } from './entities/region.schema';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: 'Region', schema: RegionSchema }]), // Registering the Admin model
    ],
  controllers: [RegionController],
  providers: [RegionService]
})
export class RegionModule {}

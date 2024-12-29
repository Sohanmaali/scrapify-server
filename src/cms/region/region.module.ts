import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionSchema } from './entities/region.schema';
import { FileSchema } from '../../cms/files/entities/file.schema';
import { FrontdendRegionController } from './Frontdendregion.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Region', schema: RegionSchema }, { name: 'File', schema: FileSchema }]), // Registering the Admin model
  ],
  controllers: [RegionController,FrontdendRegionController],
  providers: [RegionService]
})
export class RegionModule { }

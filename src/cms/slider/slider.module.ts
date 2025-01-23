import { Module } from '@nestjs/common';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';
import { SliderSchema } from './entities/slider.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { FrontdendSliderController } from './Frontendslider.controller';
import { FileSchema } from '../files/entities/file.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Slider', schema: SliderSchema },
    { name: 'File', schema: FileSchema }
    ]), // Registering the Admin model
    MulterModule.register({
      dest: '/',
    }),],

  controllers: [SliderController, FrontdendSliderController],
  providers: [SliderService]
})
export class SliderModule { }

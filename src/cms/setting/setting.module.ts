import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SettingSchema } from './entities/setting.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { FrontdendSettingController } from './Frontendsetting.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Setting', schema: SettingSchema }]), // Registering the Admin model
  ],
  controllers: [SettingController,FrontdendSettingController],
  providers: [SettingService]
})
export class SettingModule { }

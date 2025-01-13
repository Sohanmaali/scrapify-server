
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './cms/files/file.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { SettingModule } from './cms/setting/setting.module';
import { RegionModule } from './cms/region/region.module';
import { CategoryModule } from './cms/category/category.module';
import { EcommerceModule } from './modules/ecommerce/ecommerce.module';
import { StatusModule } from './cms/status/status.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SliderModule } from './cms/slider/slider.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL, {
      serverSelectionTimeoutMS: 20000,
    }),
    FileModule,
    AuthenticationModule,
    SettingModule,
    RegionModule,
    CategoryModule,
    StatusModule,
    EcommerceModule,
    DashboardModule,
    SliderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {
  constructor() {
    console.log('app module loaded');
    console.log('process.env.DB_URL:', process.env.PORT); // Check if this outputs the correct DB URL
  }
}

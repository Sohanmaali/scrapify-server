// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ItemsModule } from './items/items.module';
// import { ConfigModule } from '@nestjs/config';
// import { FileModule } from './cms/files/file.module';
// import { AokModule } from './modules/aok/aok.module';
// import { AuthenticationModule } from './modules/authentication/authentication.module';
// @Module({
//   imports: [
//     // MongooseModule.forRoot('mongodb://localhost:27017/aok', {
//     //   serverSelectionTimeoutMS: 20000,

//     MongooseModule.forRoot(
//       'mongodb+srv://sohaninfobeans4:SOHAN1234@aok-cluster.k6fsd.mongodb.net/AOKDB?retryWrites=true&w=majority',
//       // process.env.DB_URL,
//       {
//         serverSelectionTimeoutMS: 20000,
//       },
//     ),
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),

//     ItemsModule,
//     // BorrowingModule,

//     FileModule,
//     AokModule,
//     AuthenticationModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {
//   constructor() {
//     console.log('app module loaded');
//     console.log('process.env.DB_URL', process.env.DB_URL);
//   }
// }

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

import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatgorySchema } from './entities/category.schema';
import { FrontdendCategoryController } from './Frontendcategory.controller';
import { FileSchema } from '../../cms/files/entities/file.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CatgorySchema }, { name: 'File', schema: FileSchema }]), // Registering the Admin model
    MulterModule.register({
      dest: '/',
    }),],
  controllers: [CategoryController, FrontdendCategoryController],
  providers: [CategoryService]
})
export class CategoryModule { }

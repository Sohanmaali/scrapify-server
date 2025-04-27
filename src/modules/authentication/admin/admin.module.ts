import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/admin.schema';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]), // Registering the Admin model
    MulterModule.register({
      storage: multer.memoryStorage(), // Use memory storage
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService], // Export AdminService if needed in other modules
})
export class AdminModule { }

// scrap.controller.ts

import { Body, Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import * as Multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadHelper } from '../../../cms/helper/fileUploadHelper';

@Controller('scrap')
// @UseInterceptors(FileUploadInterceptor) // Use custom interceptor at class level
export class ScrapController {
  constructor(
    private readonly scrapService: ScrapService,
    // private readonly fileService: FileService, // Inject FileService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: ImageUploadHelper.storage }))
  async create(@Req() req, @Res() res, @UploadedFile() file: Express.Multer.File, @Body() data: any) {
 
//   async create(@Req() req, @Res() res, @UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded',
        });
      }


      // const data = await this.scrapService.create({
      //   ...req.body,
      //   filePath: file.path, // Optionally include the file path
      // });

        const relativePath = `uploads/${file.filename}`; // Path relative to the `public` folder

      return res.status(201).json({
        status: 'success',
        data: data,
        file: {
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          path: relativePath, // Return only the relative path
        },
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

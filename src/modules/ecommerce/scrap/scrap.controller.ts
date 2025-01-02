
import { Controller, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploadHelper } from '../../../cms/helper/fileUploadHelper';

@Controller('scrap')
@UseInterceptors(
  FileInterceptor('featured_image', ),
  FilesInterceptor('gallery', 10, ) // Max 10 files
)export class ScrapController {
  constructor(private readonly scrapService: ScrapService) { 
      
  }

  @Post()  
  async create(@Req() req, @Res() res,) {
    try {


      const data = await this.scrapService.create(req);
      return res.status(201).json({
        status: 'success',
        data: data,

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

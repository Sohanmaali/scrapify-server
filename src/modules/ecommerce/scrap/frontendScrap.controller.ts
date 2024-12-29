
import { Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploadHelper } from '../../../cms/helper/fileUploadHelper';

@Controller('public/scrap')
@UseInterceptors(
  FileInterceptor('featured_image', { storage: ImageUploadHelper.storage }),
  FilesInterceptor('gallery', 10, { storage: ImageUploadHelper.storage }) 
)
export class FrontendScrapController {
  constructor(private readonly scrapService: ScrapService) { }

  @Get("test")
  async test(@Req() req, @Res() res,) {
    try {
      console.log("req.body-=-=======-", req.body);
      return res.status(201).json({
        status: 'success',
        data: "sohan",
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }


  @Post()  
  async create(@Req() req, @Res() res,) {
    try {
      console.log("req.body-=-=======-1111", req.body);
      

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

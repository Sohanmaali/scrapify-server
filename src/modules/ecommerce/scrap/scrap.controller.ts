
import { Controller, Get, Patch, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploadHelper } from '../../../cms/helper/fileUploadHelper';
import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';

@Controller('ecommerce/scrap')
@UseInterceptors(FileFieldsInterceptor
  (
    [
      { name: 'featured_image', maxCount: 1 }, // Expect a single file for featured_image
      { name: 'gallery', maxCount: 10 },       // Expect up to 10 files for gallery
    ], 
  )
) export class ScrapController {
  constructor(private readonly scrapService: ScrapService) { }

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

  @Patch("update/:id")
  async update(@Req() req, @Res() res,) {
    try {
      const data = await this.scrapService.update(req);
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
  @Get('show/:id')
  async findOne(@Req() req, @Res() res) {
    try {
      const id = req.params.id;
      const data = await this.scrapService.findOne(req);

      return res.status(201).json(ResponseHelper.success('success', 201, "Data found", data));

    } catch (error) {
      console.error('error  ', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));

    }
  }

  @Get()
  async getAll(@Req() req, @Res() res) {
    try {

      const query = { delete_at: null };

      const data = await this.scrapService.getAll(req, query);
      return res.status(201).json(ResponseHelper.success('success', 201, "Data found", data));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));
    }

  }

  @Get('trash')
  async getTrash(@Req() req, @Res() res) {
    try {
      const query: any = { delete_at: { $ne: null } };
      const data = await this.scrapService.getTrash(req, query);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.log('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  @Patch('multi/trash')
  async multiTrash(@Req() req, @Res() res) {

    const data = this.scrapService.multiTrash(req);
    return res.status(201).json({
      message: 'success',
      data: req.body.ids,
    });
  }

  @Patch('multi/restore')
  async multiRestore(@Req() req, @Res() res) {
    // const query = de
    const data = await this.scrapService.multiRestore(req);
    return res.status(201).json({
      message: 'success',
      data: req.body.ids,
    });
  }
  @Post('multi/delete')
  async delete(@Req() req, @Res() res) {
    try {
      console.log('multi delete');

      const data = await this.scrapService.multiDelete(req);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.log('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  @Post('upload')
  async upload(@Req() req, @Res() res) {
    try {
      const data = await this.scrapService.upload(req);
      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.log('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }
}

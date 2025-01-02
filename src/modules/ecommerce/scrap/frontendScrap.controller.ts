
import { Controller, Get, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';
import mongoose from 'mongoose';
import { JwtAuthGuard, JwtCustomerGuard } from '../../../modules/authentication/auth/jwt-auth.guard';

// import { ImageUploadHelper } from '../../../cms/helper/fileUploadHelper';

@Controller('public/scrap')
@UseGuards(JwtCustomerGuard)

@UseInterceptors(FileFieldsInterceptor
  (
    [
      { name: 'featured_image', maxCount: 1 }, // Expect a single file for featured_image
      { name: 'gallery', maxCount: 10 },       // Expect up to 10 files for gallery
    ],
  )
)
export class FrontendScrapController {
  constructor(private readonly scrapService: ScrapService) { }

  
  @Post()
  async create(@Req() req, @Res() res,) {
    try {
      if (!req?.auth?._id) {
        return res.status(500).json(ResponseHelper.unauthorized("error", "500", "please login"));
      }


      

      req.body.customer = req?.auth?._id;

      const data = await this.scrapService.create(req);
      return res.status(201).json(ResponseHelper.success('success', 201, "Request submitted", data));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));
    }
  }



  @Patch("update/:id")
  async update(@Req() req, @Res() res,) {
    try {

      const data = await this.scrapService.update(req);
      return res.status(201).json(ResponseHelper.success('success', 201, "Request updated", data));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));
    }
  }


  @Get()
  async getAll(@Req() req, @Res() res) {
    try {

      console.log("req.auth._id", req?.auth);


      if (!req?.auth?._id) {
        return res.status(500).json(ResponseHelper.unauthorized("error", "500", "please login"));
      }

      const query: any = { delete_at: null, customer: new mongoose.Types.ObjectId(req?.auth?._id) };

      const data = await this.scrapService.getAll(req, query);
      return res.status(201).json(ResponseHelper.success('success', 201, "Data found", data));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));
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

}
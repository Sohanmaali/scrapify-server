import { Controller, Get, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard, JwtCustomerGuard } from '../auth/jwt-auth.guard';
import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploadHelper } from '../../../cms/helper/fileUploadHelper';

@Controller('customer')
@UseGuards(JwtCustomerGuard)
@UseInterceptors(FileFieldsInterceptor
  (
    [
      { name: 'featured_image', maxCount: 1 }, // Expect a single file for featured_image
      { name: 'gallery', maxCount: 10 },       // Expect up to 10 files for gallery
    ],
  ))
export class CustomerController {
  constructor(private customerService: CustomerService) {
  }

  @Get()
  async getAll(@Req() req, @Res() res) {
    try {
      const query: any = { delete_at: null };
      const data = await this.customerService.getAll(req, query);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.error('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  @Get("employee")
  async getAllEmployee(@Req() req, @Res() res) {
    try {
      const query: any = { delete_at: null, role: "employee" };
      const data = await this.customerService.getAll(req, query);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.error('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }




  @Post()
  async create(@Req() req, @Res() res) {
    try {
      const data = await this.customerService.create(req);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.error('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }



  @Get("search")
  async search(@Req() req, @Res() res) {
    try {

      const query: any = { delete_at: null };
      const data = await this.customerService.search(req, query);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.error('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }
  @Get("employee/search")
  async EmployeeSearch(@Req() req, @Res() res) {
    try {

      const query: any = { delete_at: null, role: "employee" };
      const data = await this.customerService.search(req, query);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.error('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  @Get('show/:id')
  async findOne(@Req() req, @Res() res) {
    try {
      const id = req.params.id;
      const data = await this.customerService.findOne(req);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.error('error  -=-=-=-=-=-=', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  @Patch('update/:id')
  async update(@Req() req, @Res() res) {
    try {

      const data = await this.customerService.update(req);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.error('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  @Get("profile")
  async getProfile(@Req() req, @Res() res) {
    try {
      const id = req.params.id;
      const data = await this.customerService.getProfile(req);


      return res.status(201).json(ResponseHelper.success("success", 201, "user Data found", data));

    } catch (error) {
      console.error('error  ', error);
      return res.status(500).json(ResponseHelper.internalError("error", "500", "Internal server error"));

    }
  }
  @Post("update-profile")
  async updateProfile(@Req() req, @Res() res) {
    try {
      // Call service method to handle the profile update logic
      const data = await this.customerService.updateProfile(req);

      // Return the successful response
      return res.status(200).json(ResponseHelper.success("success", 200, "Profile updated successfully", data));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.internalError("error", "500", "Internal server error"));
    }
  }

}
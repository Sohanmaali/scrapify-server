import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, JwtCustomerGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { generateOtp } from '../../../cms/helper/commonhelper';
import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';
import mongoose from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService
  ) { }

  @UseGuards(AuthGuard('admin-local'))
  @Post('admin/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }


  // ==============================================CUSTOMER START==============================================


  @Post('customer/register')
  async customerRegister(@Body() body: any) {
    return await this.authService.register(body);

  }

  @UseGuards(AuthGuard('customer-local'))
  @Post('customer/login')
  async Customerlogin(@Req() req) {

    if (!req?.user?.isVerified) {
      const optData = generateOtp();
      return await this.authService.update({ ...optData, _id: req?.user?._id, email: req?.user?.email });

    }

    return this.authService.login(req.user);
  }

  @Post('customer/verify')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOtp(body.email, body.otp);

  }

  @Post('customer/resend-otp')
  async resendOtp(@Req() req) {

    const optData = generateOtp();
    const data = await this.authService.update({ ...optData, ...req.body });

    return data

  }

  @Patch('change-password')
  @UseGuards(JwtCustomerGuard)
  async changePassword(@Req() req, @Res() res) {
    try {
      if (!req?.auth?._id) {
        return res.status(500).json(ResponseHelper.unauthorized("error", "500", "please login"));
      }
      const query: any = { delete_at: null, customer: new mongoose.Types.ObjectId(req?.auth?._id) };

      const data = await this.authService.changePassword(req, query);
      return res.status(201).json(ResponseHelper.success('success', 201, "Data found", "data"));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));
    }
  }

  @Post('customer/forgot-password')
  async forgotPassword(@Req() req, @Res() res) {
    try {
      const data: any = await this.authService.findByEmail(req);
      return res.status(201).json(ResponseHelper.success('success', 201, data?.message,));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));
    }
  }

  @Post('customer/update-password')
  async updatePassword(@Req() req, @Res() res) {
    try {

      const query: any = { delete_at: null };

      const data = await this.authService.updatePassword(req, query);
      return res.status(201).json(ResponseHelper.success('success', 201, data, "data"));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));
    }
  }

  // @Post('/SendOtp')
  // async sendOtp(@Body() data: { phone: string }): Promise<{ msg: string }> {
  //   let prefix = '+91';
  //   let phone = prefix.concat(data.phone);
  //   return await this.auth.sendOtp(phone);
  // }

  // @Post('send')
  // async sendMessage(@Body() body: { to: string; message: string }) {
  //   const { to, message } = body;
  //   return this.authService.sendOtp(to, message);
  // }

}



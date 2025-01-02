import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminLocalStrategy } from './local.strategy';
import { CustomerLocalStrategy } from './local.strategy';
import { AuthGuard } from '@nestjs/passport';
import { generateOtp } from '../../../cms/helper/commonhelper';
import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(AuthGuard('admin-local'))
  @Post('admin/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  // Admin change password
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: any) {
    //  return this.authService.changePassword(req.user, changePasswordDto);
  }

  @Post('test')
  async create(@Request() req) {
    return { data: 'sohan' }; // this.authService.create(req.body);
  }



  @Post('customer/register')
  async customerRegister(@Body() body: any) {


    // try {
    return await this.authService.register(body);
    // return result;
    // } catch (error) {
    //   return error.message
    // }

    
  }


  @UseGuards(AuthGuard('customer-local'))
  @Post('customer/login')

  async Customerlogin(@Req() req) {

    if (!req?.user?.isVerified) {
      const optData = generateOtp();

      return await this.authService.update({ ...optData, _id: req?.user?._id });

    }

    return this.authService.login(req.user);
  }
  


  @Post('customer/verify')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    console.log("-=-=====-=111111", body);

    return this.authService.verifyOtp(body.email, body.otp);
    //  ResponseHelper.success("success", 201, "success", data);
    //  return
  }

  // @UseGuards(AuthGuard('customer-local'))
  @Post('customer/resend-otp')
  async resendOtp(@Req() req) {

    const optData = generateOtp();

    const data= await this.authService.update({ ...optData, ...req.body });

    console.log("-=-=====-=111111", data);

    return data

  }

  // @Post('/SendOtp')
  // async sendOtp(@Body() data: { phone: string }): Promise<{ msg: string }> {
  //   let prefix = '+91';
  //   let phone = prefix.concat(data.phone);
  //   return await this.auth.sendOtp(phone);
  // }

  @Post('send')
  async sendMessage(@Body() body: { to: string; message: string }) {
    const { to, message } = body;
    return this.authService.sendOtp(to, message);
  }

}



import {
  Body,
  Controller,
  Get,
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
console.log("-=-=-==-=-=---=sohan");

    return body;
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard('customer-local'))
  @Post('customer/login')
  async Customerlogin(@Req() req) {

    if (true) {
      
    }

    return this.authService.login(req.user);
  }


  @Post('customer/verify')
  async verifyOtp(@Body() body: { email: string; otp: string }, ) {
    try {
      return this.authService.verifyOtp(body.email, body.otp);
    } catch (error) {
      return error
    }
  }
}



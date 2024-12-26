import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
// import { customerModel } from '../customer/customer.service';
import { Customer } from '../customer/entities/customer.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CustomerService } from '../customer/customer.service';

// import { ChangePasswordDto } from '../admin/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private customerService: CustomerService,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,

    private jwtService: JwtService,
  ) { }

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.adminService.validateAdmin(email, password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return admin;
  }

  async validateCustomer(email: string, password: string): Promise<any> {
    const admin = await this.customerService.validateCustomer(email, password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return admin;
  }

  async login(admin: any) {
    const payload = {
      email: admin.email,
      _id: admin._id,
      first_name: admin?.name,
      mobile: admin?.mobile,
      featured_image: admin?.featured_image,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(admin: any, changePasswordDto: any) {
    // return this.adminService.changePassword(admin.id, changePasswordDto);
  }
  async register(body: any) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 1);

    const customer = await this.customerModel.findOne({ mobile: body.mobile });
    if (!customer) {
      const { password } = body
      const saltRounds = 10; // Higher rounds make it more secure but slower
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await this.customerModel.create({
        ...body,
        otp: "1234",
        password: hashedPassword,
        otpExpiry,
      });
      return { message: 'OTP sent successfully' };
    } else {
      throw new Error('user already exist');
    }

  }

  async verifyOtp(email: string, otp: string) {
    const customer = await this.customerModel.findOne({ email });
    
    // Compare expiry time in milliseconds to avoid timezone issues
    const currentTime = new Date().getTime(); // Current time in milliseconds
    const otpExpiryTime = new Date(customer.otpExpiry).getTime(); // Customer OTP expiry time in milliseconds
      

    if (!customer || customer.otp != otp || currentTime >= otpExpiryTime) {
      throw new Error('Invalid OTP');
    }

    await this.customerModel.updateOne(
      { email },
      { isVerified: true, otp: null }
    );

    return {
      access_token: this.jwtService.sign({ id: customer._id, email, mobile: customer.mobile }),
    };
  }
}
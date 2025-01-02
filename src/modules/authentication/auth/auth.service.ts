import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
// import { customerModel } from '../customer/customer.service';
import { Customer } from '../customer/entities/customer.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CustomerService } from '../customer/customer.service';
import { generateOtp } from '../../../cms/helper/commonhelper';
import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';
import { MailHelper } from '../../../cms/helper/mail.helper';
import { Twilio } from 'twilio';

// import { ChangePasswordDto } from '../admin/dto/change-password.dto';

@Injectable()
export class AuthService {
  private twilioClient: Twilio;
  constructor(
    private readonly mailHelper: MailHelper,

    private adminService: AdminService,
    private customerService: CustomerService,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,

    private jwtService: JwtService,
  ) { 

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    this.twilioClient = new Twilio(accountSid, authToken);
 
  }

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
      ResponseHelper.notFound('error', "404", "user not found");
    }

    return admin;
  }

  async login(admin: any) {
    const payload = {
      email: admin.email,
      _id: admin._id,
      name: admin?.name,
      mobile: admin?.mobile,
      featured_image: admin?.featured_image,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: payload
    };
  }

  async changePassword(admin: any, changePasswordDto: any) {
    // return this.adminService.changePassword(admin.id, changePasswordDto);
  }
  async register(body: any) {
    const { otp, otpExpiry } = generateOtp();

    // Check if email or mobile exists
    const existingCustomer = await this.customerModel.findOne({
      $or: [
        { email: body.email },
        { mobile: body.mobile },
      ],
    });

    if (existingCustomer) {
      // If email exists
      if (existingCustomer.email === body.email) {
        ResponseHelper.conflict('error', "1100", "Email already exists");
        return;
      }

      // If mobile exists
      if (existingCustomer.mobile === body.mobile) {
        ResponseHelper.conflict('error', "1100", "Mobile number already exists");
        return;
      }
    }

    // If both email and mobile are unique, proceed with registration
    const { password } = body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await this.customerModel.create({
      ...body,
      otp: "1234",  // Or use `otp` from `generateOtp()` if needed
      password: hashedPassword,
      otpExpiry,
    });
    console.log("-=-=-=-==-=-=body", body);

    if (body.email) {
      await this.mailHelper.sendMailWithTemplate(body.email, "Registration Successfully Done", "welcome-email", body);
    }


    return { message: 'OTP sent' };
  }


  async verifyOtp(email: string, otp: string) {
    const customer: any = await this.customerModel.findOne({ email });

    const currentTime = new Date().getTime(); // Current time in milliseconds
    const otpExpiryTime = new Date(customer?.otpExpiry).getTime(); // Customer OTP expiry time in milliseconds

    if (!customer) {
      ResponseHelper.notFound('Invalid OTP', "400", "Invalid OTP provided or expired.");
      return
    }
    if (customer.otp != otp) {
      ResponseHelper.notFound('Invalid OTP', "400", 'Invalid OTP provided');

    }
    if (currentTime >= otpExpiryTime) {
      ResponseHelper.notFound('Invalid OTP', "400", 'OTP expired');

    }

    const payload = {
      email: customer.email,
      _id: customer._id,
      name: customer?.name,
      mobile: customer?.mobile,
      featured_image: customer?.featured_image,
    };


    await this.customerModel.updateOne(
      { email },
      { isVerified: true }
    );
    return ResponseHelper.success('success', 201, "login success", {
      access_token: this.jwtService.sign({ id: customer._id, email, mobile: customer.mobile }),
      user: payload,

    });

  }


  async update(otpData) {
    try {

      console.log("otpData", otpData);
      const { email } = otpData;

      delete otpData.email;
      const updatedCustomer = await this.customerModel.findOneAndUpdate(
        { email }, // Find customer by email
        otpData,
        { new: true } // Return the updated document
      );

      return ResponseHelper.success('success', 201, "OTP send successfully",);

    } catch (error) {
      return ResponseHelper.conflict('error', "500", "Enternal server error");

    }
  }

  // async sendOtp(phoneNumber: string) {
  //   const serviceSid =process.env.TZTWILIO_VERIFICATION_SERVICE_SID
  //   let msg = '';
  //   await this.twilioClient.verify.v2
  //     .services(serviceSid)
  //     .verifications.create({ to: phoneNumber, channel: 'sms' })
  //     .then((verification) => (msg = verification.status));
  //   return { msg: msg };
  // }
  async sendOtp(to: string, message: string): Promise<any> {
    const from = process.env.TWILIO_SENDER_PHONE_NUMBER
    return this.twilioClient.messages.create({
      body: message,
      from,
      to,
    });
  }
}
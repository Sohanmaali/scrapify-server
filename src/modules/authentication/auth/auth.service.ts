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

    // const accountSid = process.env.TWILIO_ACCOUNT_SID
    // const authToken = process.env.TWILIO_AUTH_TOKEN

    // this.twilioClient = new Twilio(accountSid, authToken);

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
      role: admin?.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload
    };
  }

  async changePassword(req, query?) {

    const { old_password, new_password } = req.body

    const email = req?.auth?.mail;

    const customerData: any = this.customerModel.findOne({ email }).select("+password")

    if (customerData && (await bcrypt.compare(old_password, customerData.password))) {
      return customerData;
    }

    return customerData;
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
      otp: otp,
      password: hashedPassword,
      otpExpiry,
    });

    if (body.email) {
      await this.mailHelper.sendMail(body.email, "Your OTP for login", "otp", { otp, name: body.name });

      await this.mailHelper.sendMail(body.email, "Registration Successfully ", "welcome-email", body);
    }


    return { message: 'OTP successfully sent to your email' };
  }

  async verifyOtp(email: string, otp: string) {
    const customer: any = await this.customerModel.findOne({ email });

    const currentTime = new Date().getTime();
    const otpExpiryTime = new Date(customer?.otpExpiry).getTime();

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
      role: customer?.role,
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

      const { email } = otpData;

      delete otpData.email;


      if (email) {
        await this.mailHelper.sendMail(email, "Your OTP for login", "otp", otpData);
      }
      const updatedCustomer = await this.customerModel.findOneAndUpdate(
        { email },
        otpData,
        { new: true }
      );
      return ResponseHelper.success('success', 201, "OTP successfully sent to your email",);

    } catch (error) {
      return ResponseHelper.conflict('error', "500", "Enternal server error");

    }
  }

  async findByEmail(req) {
    const user: any = await this.customerModel.findOne({
      email: req?.body?.email, delete_at: null,
      // status: 'active'
    });

    if (!user) {
      ResponseHelper.notFound('error', "404", "user not found");
    }
    const { otp, otpExpiry } = generateOtp();
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    return await this.update({ email: req?.body?.email, otp, otpExpiry });

  }

  async updatePassword(req, query) {
    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result: any = await this.customerModel.updateOne(
      { email: req.body.email, delete_at: null, }, // Filter query
      { $set: { password: hashedPassword } }
    );

    if (result.nModified === 0) {
      throw new Error("User not found or password not updated");
    }
    return "Password updated successfully"
  }

}
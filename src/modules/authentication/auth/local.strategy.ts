// src/modules/authentication/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { AuthService } from './auth.service';
import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy, "admin-local") {
  constructor(private authService: AuthService) {

    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const admin = await this.authService.validateAdmin(email, password);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return admin;
  }
}
  

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(Strategy, "customer-local") {
  constructor(private authService: AuthService) {

    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log("-==-==-=-==-", email, password);


    const customer = await this.authService.validateCustomer(email, password);
    return customer;
  }
}

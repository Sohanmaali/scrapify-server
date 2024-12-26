import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './entities/auth.schema';
import { AdminModule } from '../admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AdminLocalStrategy, CustomerLocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerModule } from '../customer/customer.module';
import { CustomerSchema } from '../customer/entities/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema },{ name: 'Customer', schema: CustomerSchema }]),
    forwardRef(() => AdminModule),
    forwardRef(() => CustomerModule),


    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminLocalStrategy, CustomerLocalStrategy],
  exports: [AuthService],
})
export class AuthModule { }

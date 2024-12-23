import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StatusSchema } from './entities/status.schema';

@Module({

  imports: [
      MongooseModule.forFeature([{ name: 'Status', schema: StatusSchema }]), // Registering the Admin model
    ],
  providers: [StatusService],
  controllers: [StatusController]
})
export class StatusModule {}

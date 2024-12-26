import { Module } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { ScrapController } from './scrap.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapSchema } from './entities/scrap.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
 imports: [
      MongooseModule.forFeature([{ name: 'Scrap', schema: ScrapSchema }]), // Registering the Admin model
      MulterModule.register({
        dest: './uploads/images', // Path where files will be stored
      }),
    ],

  providers: [ScrapService],
  controllers: [ScrapController]
})
export class ScrapModule {}

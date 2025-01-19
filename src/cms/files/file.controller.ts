import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../../modules/authentication/auth/jwt-auth.guard';

@Controller('cms/file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  async getAll(@Req() req, @Res() res) {
    try {
      const data = await this.fileService.getAll(req);

      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      console.log('error  ', error);
      return res.status(500).json({
        status: 'error',
        data: error.message,
      });
    }
  }

  @Post('create')
  async create(@Req() req, @Res() res) {
    console.log('file');

    try {
      const data = { fghjkjhg: 'ghjkuhn' }; //await this.fileService.create(req);

      return res.status(201).json({
        message: 'success',
        data: data,
      });
    } catch (error) {
      console.log('error  ', error);
      return res.status(500).json({
        message: 'error',
        data: error.message,
      });
    }
  }
}

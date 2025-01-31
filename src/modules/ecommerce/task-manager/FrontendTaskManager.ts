import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { TaskManagerService } from './TaskManager.service';

import mongoose from 'mongoose';

import { ResponseHelper } from '../../../cms/helper/custom-exception.filter';;
import { JwtAuthGuard, JwtCustomerGuard } from '../../../modules/authentication/auth/jwt-auth.guard';


@Controller('public/task-manager')
@UseGuards(JwtCustomerGuard)
export class FrontendTaskManagerController {
  constructor(private readonly TaskManagerService: TaskManagerService) { }


 @Get('all')
  async getAll(@Req() req, @Res() res) {
    try {
      if (!req?.auth?._id) {
        return res.status(500).json(ResponseHelper.unauthorized("error", "500", "please login"));
      }
      const query: any = { delete_at: null, employee: new mongoose.Types.ObjectId(req?.auth?._id) };
      const data = await this.TaskManagerService.findAllTaskByUserId(req, query);
      return res.status(201).json(ResponseHelper.success('success', 201, "Data found", data));
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(ResponseHelper.unauthorized("error", "500", error?.details || error?.message || "Internal server error"));
    }

  }
    

}

import { Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {
    console.log('Dashboard controller loaded');
  }

  @Get('count')
  async getDashboardCounting(@Req() req, @Res() res) {
    try {
      const data = await this.dashboardService.getDashboardCounting(req);

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
}

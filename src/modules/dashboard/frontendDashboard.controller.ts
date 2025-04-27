import { Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('public/dashboard')
export class FrontendDashboardController {
  constructor(private dashboardService: DashboardService) {

  }

  @Get('search')
  async globalSearch(@Req() req, @Res() res) {
    try {
      const data = await this.dashboardService.globalSearch(req);

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

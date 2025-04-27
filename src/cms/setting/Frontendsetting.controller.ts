import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SettingService } from './setting.service';

@Controller('public/setting')
export class FrontdendSettingController {


    constructor(
        private readonly settingService: SettingService
    ) { }

    @Get("/:id")
    async get(@Req() req, @Res() res) {
        try {


            const data = await this.settingService.get(req);

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

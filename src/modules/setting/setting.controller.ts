import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {


    constructor(
        private readonly settingService: SettingService
    ) { }

    @Post("/:id")
    async create(@Req() req, @Res() res) {
        try {

            const options = { new: true, upsert: true };

            const newData = { ...req?.body, name: req?.params?.id };

            const data = await this.settingService.createOrUpdate(newData, options);

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

    @Get("/:id")
    async get(@Req() req, @Res() res) {
        try {


            const data = await this.settingService.get(req?.params?.id);

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

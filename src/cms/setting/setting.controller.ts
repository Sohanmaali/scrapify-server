import { Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { SettingService } from './setting.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('cms/setting')
@UseInterceptors(FileFieldsInterceptor
    (
        [
            { name: 'featured_image', maxCount: 1 }, // Expect a single file for featured_image
            { name: 'gallery', maxCount: 10 },       // Expect up to 10 files for gallery
            { name: 'slider', maxCount: 10 },       // Expect up to 10 files for gallery
        ],
    )
)
export class SettingController {


    
    constructor(
        private readonly settingService: SettingService
    ) { }

    @Post("/:id")
    async create(@Req() req, @Res() res) {
        try {

            const data = await this.settingService.createOrUpdate(req);

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

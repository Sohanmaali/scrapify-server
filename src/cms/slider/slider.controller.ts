import { Controller, Get, Patch, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { SliderService } from './slider.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('cms/slider')
@UseInterceptors(FileFieldsInterceptor
    (
        [
            { name: 'featured_image', maxCount: 1 }, // Expect a single file for featured_image
            { name: 'gallery', maxCount: 10 },       // Expect up to 10 files for gallery
            { name: 'slider', maxCount: 10 },       // Expect up to 10 files for gallery
        ],
    )
)
export class SliderController {



    constructor(
        private readonly sliderService: SliderService
    ) { }

    @Post("")
    async create(@Req() req, @Res() res) {
        try {

            const data = await this.sliderService.create(req);

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

    @Get()
    async get(@Req() req, @Res() res) {
        try {

            const data = await this.sliderService.findAll(req);

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

    @Get("show/:id")
    async findOne(@Req() req, @Res() res) {
        try {

            const data = await this.sliderService.findOne(req);

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

    @Patch("update/:id")
    async update(@Req() req, @Res() res) {
        try {

            const data = await this.sliderService.update(req);

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

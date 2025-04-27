import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SliderService } from './slider.service';

@Controller('public/slider')
export class FrontdendSliderController {


    constructor(
        private readonly sliderService: SliderService
    ) { }

    @Get("show/:id")
    async get(@Req() req, @Res() res) {
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
}

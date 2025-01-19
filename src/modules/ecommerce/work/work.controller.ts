import { Controller, Post, Req, Res } from '@nestjs/common';
import { WorkService } from './work.service';

@Controller('ecommerce/work')
export class WorkController {

    constructor(private readonly workService: WorkService) { }

    @Post()
    async create(@Req() req, @Res() res,) {
        try {
            const data = await this.workService.create(req);
            return res.status(201).json({
                status: 'success',
                data: data,

            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

}

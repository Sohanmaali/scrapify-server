import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {

    constructor(
        private readonly statusService: StatusService
    ) { }

    @Get()
    async findAll(@Req() req, @Res() res) {
        try {

            const query = { delete_at: null };

            const data = await this.statusService.findAll(req, query);

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

    @Post()
    async create(@Req() req, @Res() res) {
        try {
            const data = await this.statusService.create(req);

            return res.status(201).json({
                status: 'success',
                data: data,
            });
        } catch (error) {
            console.error('error  ', error);
            return res.status(500).json({
                status: 'error',
                data: error.message,
            });
        }
    }


    @Get("show/:id")
    async get(@Req() req, @Res() res) {
        try {
            const id = req.params.id;
            const data = await this.statusService.findOne(req);

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

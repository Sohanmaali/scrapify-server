import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('cms/contact')
export class ContactController {

    constructor(private readonly contactService: ContactService) { }

    @Post('create')
    async create(@Req() req, @Res() res,) {

        try {
            console.log("-=-=-=-=req.body", req.body);

            const data = await this.contactService.create(req);
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

    @Get()
    async getAll(@Req() req, @Res() res,) {

        try {
            const query = { delete_at: null }

            const data = await this.contactService.findAll(req, query);
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

    @Get("search")
    async search(@Req() req, @Res() res) {
        try {

            const query: any = { delete_at: null };
            const data = await this.contactService.search(req, query);

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
    @Post('multi/delete')
    async delete(@Req() req, @Res() res) {
        try {
            console.log('multi delete');

            const data = await this.contactService.multiDelete(req);

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

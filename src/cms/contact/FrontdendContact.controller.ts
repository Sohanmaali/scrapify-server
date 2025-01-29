import { Controller, Post, Req, Res } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('public/contact')
export class FrontdendContactController {

    constructor(private readonly contactService: ContactService) { }

    @Post('create')
    async create(@Req() req, @Res() res,) {

        try {
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

}

import { Controller, Get, Injectable, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { RegionService } from './region.service';
import mongoose from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { Types } from 'mongoose';

@Controller('cms/region')
@UseInterceptors(FileFieldsInterceptor
    (
        [
            { name: 'featured_image', maxCount: 1 }, // Expect a single file for featured_image
            { name: 'gallery', maxCount: 10 },       // Expect up to 10 files for gallery
        ],
    ))
export class RegionController {

    constructor(
        private readonly regionService: RegionService
    ) { }

    @Post()
    async create(@Req() req, @Res() res) {
        try {
            const query: any = { delete_at: null };
            const data = await this.regionService.create(req, query);

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

    @Get("/:type")
    async findType(@Req() req, @Res() res) {
        try {



            const query: any = { delete_at: null, type: req.params.type };
            const data = await this.regionService.findByType(req, query);

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
    @Get("/country")
    async findAllCountry(@Req() req, @Res() res) {
        try {
            const query: any = { delete_at: null, type: "country" };
            const data = await this.regionService.findAllCountry(req, query);

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




    // @Get()
    // async findType(@Req() req, @Res() res) {
    //     try {

    //         const query: any = { delete_at: null };
    //         const data = await this.regionService.findAll(req, query);

    //         return res.status(201).json({
    //             status: 'success',
    //             data: data,
    //         });
    //     } catch (error) {
    //         console.error('error  ', error);
    //         return res.status(500).json({
    //             status: 'error',
    //             data: error.message,
    //         });
    //     }
    // }


    @Get("type/:type")
    async findAll(@Req() req, @Res() res) {
        try {

            const query: any = { delete_at: null, type: req.params.type };
            const data = await this.regionService.findAll(req, query);

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

    @Get("children/:id")
    async findChildren(@Req() req, @Res() res) {
        try {


            const query: any = { delete_at: null, parent: new mongoose.Types.ObjectId(req.params.id) };


            const data = await this.regionService.findAll(req, query);

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
    async findOne(@Req() req, @Res() res) {
        try {
            const query: any = { delete_at: null };
            const data = await this.regionService.findOne(req);

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


            const data = await this.regionService.multiDelete(req);

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

}

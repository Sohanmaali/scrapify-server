import { Controller, Get, Injectable, Post, Req, Res } from '@nestjs/common';
import { RegionService } from './region.service';
import mongoose from 'mongoose';
// import { Types } from 'mongoose';

@Controller('region')
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
            console.log('error  ', error);
            return res.status(500).json({
                status: 'error',
                data: error.message,
            });
        }
    }

    @Get()
    async findType(@Req() req, @Res() res) {
        try {
            
            const query: any = { delete_at: null };
            const data = await this.regionService.findAll(req, query);

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


    @Get("type/:type")
    async findAll(@Req() req, @Res() res) {
        try {
            console.log("type", req.params.type);
            
            const query: any = { delete_at: null, type: req.params.type };
            const data = await this.regionService.findAll(req, query);

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

    @Get("children/:id")
    async findChildren(@Req() req, @Res() res) {
        try {

            console.log("children", req.params.id);
            
            const query: any = { delete_at: null, parent: new mongoose.Types.ObjectId(req.params.id) };

            console.log("Query being passed to findAll:", query);

            const data = await this.regionService.findAll(req, query);

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
            const query: any = { delete_at: null };
            const data = await this.regionService.findOne(req);

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

    @Post('multi/delete')
    async delete(@Req() req, @Res() res) {
        try {

            console.log("multi delete", req.body.ids);

            const data = await this.regionService.multiDelete(req);

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

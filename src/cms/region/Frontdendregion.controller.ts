import { Controller, Get, Injectable, Post, Req, Res } from '@nestjs/common';
import { RegionService } from './region.service';
import mongoose from 'mongoose';
import { ResponseHelper } from '../../cms/helper/custom-exception.filter';
// import { Types } from 'mongoose';

@Controller('public/region')
export class FrontdendRegionController {

    constructor(
        private readonly regionService: RegionService
    ) { }


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


    @Get()
    async findAll(@Req() req, @Res() res) {
        try {

            const query: any = { delete_at: null };
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
            const query: any = { delete_at: null, parent: new mongoose.Types.ObjectId(req?.params?.id) };

            const data = await this.regionService.findByType(req, query);
            return res.status(201).json(ResponseHelper.success("success", 201, "Data found", data));

            
        } catch (error) {
            console.error('error  ', error);
            return res.status(500).json(ResponseHelper.internalError("error", "500", "Internal server error"));

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


}

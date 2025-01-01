// import { Controller } from '@nestjs/common';

// @Controller('category')
// export class CategoryController {}


import { Controller, Get, Injectable, Patch, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadHelper } from '../../cms/helper/fileUploadHelper';
// import { Types } from 'mongoose';

@Controller('cms/category')
@UseInterceptors(FileInterceptor('featured_image', )) // Use Multer at the class level

export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post()
    async create(@Req() req, @Res() res) {
        
        try {
            const query: any = { delete_at: null };
            const data = await this.categoryService.create(req, query);

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



    @Patch("update/:id")
    async update(@Req() req, @Res() res) {
        try {
            const query: any = { delete_at: null };
            const data = await this.categoryService.update(req, query);

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

            const query: any = { delete_at: null, parent: null };
            const data = await this.categoryService.findAll(req, query);

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


    @Get("type/:type")
    async findByType(@Req() req, @Res() res) {
        try {
            console.error("type", req.params.type);

            const query: any = { delete_at: null, type: req.params.type };
            const data = await this.categoryService.findAll(req, query);

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

    @Get("type/:id")
    async findAllByParent(@Req() req, @Res() res) {
        try {

            console.error("-=-=-=-=", req.params.id);

            const query: any = { delete_at: null, parent: new mongoose.Types.ObjectId(req.params.id) };

            const data = await this.categoryService.findAll(req, query);

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

            console.error("children", req.params.id);

            const query: any = { delete_at: null, parent: new mongoose.Types.ObjectId(req.params.id) };

            console.error("Query being passed to findAll:", query);

            const data = await this.categoryService.findAll(req, query);

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
            const data = await this.categoryService.findOne(req);

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

            console.error("multi delete", req.body.ids);

            const data = await this.categoryService.multiDelete(req);

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

import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as hbs from 'hbs';
import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'buffer';
import { ensureUniqueSlug, generateSlug } from './slugHelper';

export class CmsHelper {
  constructor() { }

  static async findOne(req, model) {
    const query: any = {};

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      query._id = req.params.id;
    } else {
      query.slug = req.params.id;
    }

    return model.findOne(query);
  }



  static async findByType(type, req, model) {

    return model.findOne({ [type]: req.body[type] });
  }

  // Create a new entry
  // static async create(req, model, fileModel?) {
  //   try {
  //     const data = req.body;
  //     console.log('data', data);

  //     const name = data.name || data.title; 
  //     if (!name) {
  //       throw new Error('Name or title is required to generate a slug');
  //     }

  //     if (req?.file) {
  //       const filePath = req?.file?.path;
  //       const relativeFilePath = filePath.replace(process.cwd() + '\\public', '');
  //       const imageData = {
  //         destination: req?.file?.destination,
  //         filename: req?.file?.filename,
  //         filepath: relativeFilePath
  //       }

  //       const fileData = await fileModel.create(imageData);
  //       if (fileData) {
  //         data.featured_image = fileData._id
  //       }
  //     }

  //     const slug = generateSlug(name);

  //     // Ensure the slug is unique in the database
  //     const uniqueSlug = await ensureUniqueSlug(slug, model);

  //     // Add the slug to the data object
  //     data.slug = uniqueSlug;

  //     // Save the entry to the database
  //     return await model.create(data);
  //   } catch (error) {
  //     console.error('Error creating new entry:', error);
  //     throw new Error('Error creating new entry');
  //   }
  // }


  static async create(req, model, fileModel?) {
    try {
      const data = req.body;
      console.log('data', data);

      const name = data.name || data.title;
      if (!name) {
        throw new Error('Name or title is required to generate a slug');
      }

      // Handle single image for featured_image
      if (req?.file) {
        const filePath = req?.file?.path;
        const relativeFilePath = filePath.replace(process.cwd() + '\\public', '');

        const imageData = {
          destination: req?.file?.destination,
          filename: req?.file?.filename,
          filepath: relativeFilePath
        };

        // Save the single file (featured image) in the fileModel
        const fileData = await fileModel.create(imageData);
        if (fileData) {
          data.featured_image = fileData._id; // Store in featured_image if it's a single file
        }
      }

      // Handle multiple images for gallery
      const galleryImageIds = [];
      if (req?.files && req.files.length > 0) {
        for (const file of req.files) {
          const filePath = file?.path;
          const relativeFilePath = filePath.replace(process.cwd() + '\\public', '');

          const imageData = {
            destination: file?.destination,
            filename: file?.filename,
            filepath: relativeFilePath
          };

          // Save each file (gallery image) in the fileModel
          const fileData = await fileModel.create(imageData);
          if (fileData) {
            galleryImageIds.push(fileData._id); // Store multiple image IDs in the gallery array
          }
        }

        // Assign gallery image IDs to the data object if any multiple images exist
        if (galleryImageIds.length > 0) {
          data.gallery = galleryImageIds;
        }
      }

      const slug = generateSlug(name);

      // Ensure the slug is unique in the database
      const uniqueSlug = await ensureUniqueSlug(slug, model);

      // Add the slug to the data object
      data.slug = uniqueSlug;

      // Save the entry to the database
      return await model.create(data);
    } catch (error) {
      console.error('Error creating new entry:', error);
      throw new Error('Error creating new entry');
    }
  }

  // Update an entry
  static async update(req, model, fileModel?) {
    try {
      const { id } = req.params;
      const data = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID');
      }

      // console.log("=-=-======-=-====", data?.featured_image);

      if (data?.children == "" || data?.children == null) {
        data.children = [];

      }
      if (data.featured_image?._id) {
        data.featured_image = new mongoose.Types.ObjectId(data.featured_image?._id)
      }


      if (req?.file) {
        const filePath = req?.file?.path;
        const relativeFilePath = filePath.replace(process.cwd() + '\\public', '');
        const imageData = {
          destination: req?.file?.destination,
          filename: req?.file?.filename,
          filepath: relativeFilePath
        }

        const fileData = await fileModel.create(imageData);
        if (fileData) {
          data.featured_image = fileData._id
        }
      }

      const updatedEntry = await model.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (!updatedEntry) {
        throw new Error('Entry not found');
      }
      console.log('Entry updated:', updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Error updating entry:', error);
      throw new Error('Error updating entry');
    }
  }

  static async search(req, model) {
    try {
      // Extract search term from query parameters
      const { search } = req.query;
      let query: any = { delete_at: null };

      // If a search term is provided, modify the query to include an $or condition
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      // Execute the query to find matching documents
      const data = await model.find(query);
      return data;
    } catch (error) {
      console.error('Error searching entry:', error);
      throw new Error('Error searching entry');
    }
  }

  // Get an entry
  static async getAll(req, model) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID');
      }
      const entry = await model.findById(id);
      if (!entry) {
        throw new Error('Entry not found');
      }
      console.log('Entry retrieved:', entry);
      return entry;
    } catch (error) {
      console.error('Error retrieving entry:', error);
      throw new Error('Error retrieving entry');
    }
  }

  //MultiTrash
  static async multiTrash(req, model) {
    const ids = req.body.ids;
    const query = { delete_at: new Date() };
    const data = await model.updateMany({ _id: { $in: ids } }, { $set: query });
    return data;
  }

  //MultiRestore
  static async multiRestore(req, model) {
    const ids = req.body.ids;
    const query = { delete_at: null };
    console.log(ids);

    const data = await model.updateMany({ _id: { $in: ids } }, { $set: query });
    return data;
  }

  //MultiDelete
  static async multiDelete(req, model) {
    const ids = req.body.ids;


    const data = await model.deleteMany({ _id: { $in: ids } });
    return data;
  }

  static async generatePDF(printData: any): Promise<Buffer> {
    const data = JSON.parse(JSON.stringify(printData));
    const templatePath = path.join(
      __dirname,
      '..',
      '../template',
      'customerBill.hbs',
    );

    const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = hbs.compile(template);

    const html = compiledTemplate(data);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  }
}

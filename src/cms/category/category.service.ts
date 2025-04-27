import { Injectable } from '@nestjs/common';
import { CmsHelper } from '.././../cms/helper/cmsHelper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.schema';

import { CustomPagination } from '../../cms/helper/piplineHalper';
import { ensureUniqueSlug, generateSlug } from '../../cms/helper/slugHelper';
import { TreeHelper } from '../../cms/helper/TreeHelper';
import { File } from '../../cms/files/entities/file.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('File') private readonly fileModel: Model<File>,
  ) {}

  async findOne(req) {
    const data = await CmsHelper.findOne(req, this.categoryModel);

    return data;
  }

  async update(req, query?) {
    return await TreeHelper.update(req, this.categoryModel, this.fileModel);
  }
  async delete(req) {
    return `This action removes a #${'id'} region`;
  }

  async create(req, query?) {
    const { body } = req;
    console.log('-=-==-=-=-body-=-=', body);

    if (body?.type === 'other') {
      try {
        let slug = generateSlug(body.other);
        slug = await ensureUniqueSlug(slug, this.categoryModel);

        // Create the parent entry
        const data = { name: body.other, slug, module: 'Category' };
        req.body.module = 'Category';
        const createdEntry = await CmsHelper.create(
          { body: data },
          this.categoryModel,
        );

        if (Array.isArray(req.body.name)) {
          const createdEntries = await Promise.all(
            req.body.name.map(async (name) => {
              let slug = generateSlug(name);
              slug = await ensureUniqueSlug(slug, this.categoryModel);

              const childData = {
                ...req.body,
                type: createdEntry?.slug,
                name,
                slug,
                parent: createdEntry._id,
              };

              // Create child entry
              const created = await CmsHelper.create(
                { body: childData },
                this.categoryModel,
              );
              createdEntry.children.push(created._id);

              return created;
            }),
          );

          // Save the parent entry with updated children
          await createdEntry.save();

          return createdEntries; // Return all created entries
        }

        await createdEntry.save();

        return createdEntry; // Return the created parent entry
      } catch (error) {
        console.error('Error creating entry:', error);
        throw new Error('Failed to create entry');
      }
    } else {
      if (Array.isArray(body.name)) {
        const createdEntries = await Promise.all(
          body.name.map(async (name) => {
            let slug = generateSlug(name);
            slug = await ensureUniqueSlug(slug, this.categoryModel);

            const data = { ...body, name, slug };
            body.module = 'Category';

            const createdEntry = await CmsHelper.create(
              { body: data },
              this.categoryModel,
            );
            if (body.parent) {
              await this.categoryModel.updateOne(
                { _id: body.parent },
                { $push: { children: createdEntry._id } },
              );
            }

            return createdEntry;
          }),
        );

        return createdEntries; // Return all created entries
      }
    }

    // Handle the case when body.other is not provided
  }

  async multiDelete(req, query?) {
    const data = await CmsHelper.multiDelete(req, this.categoryModel);
    return data;
  }

  async search(req, query?) {
    return await CmsHelper.search(req, this.categoryModel);
  }

  async findAll(req, query?) {
    const result = await this.categoryModel
      .find(query)
      .populate('children')
      .exec();

    return result;
  }
}

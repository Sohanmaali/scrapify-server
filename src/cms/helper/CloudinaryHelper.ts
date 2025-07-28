

import AdmZip from 'adm-zip';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const ImageUploadHelper = async (req, fileModel) => {
  const uploadToCloudinary = async (buffer, mimetype, module) => {
    const year = new Date().getFullYear();
    const month = new Date().toLocaleString('default', { month: 'long' });

    const uploadPath = `images/${year}/${month}`;
    const base64Data = buffer.toString('base64');

    const uploadResult = await cloudinary.uploader.upload(
      `data:${mimetype};base64,${base64Data}`,
      {
        folder: uploadPath,
        resource_type: 'auto',
      }
    );

    const fileDetails = {
      destination: uploadPath,
      filepath: uploadResult.secure_url,
      filename: uploadResult.original_filename,
      public_id: uploadResult.public_id,
      mimeType: mimetype,
      size: buffer.length,
      module: module,
    };

    const savedFile = await fileModel.create(fileDetails);
    return savedFile;
  };

  const processZip = async (zipBuffer, module) => {
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    const imageFiles = zipEntries.filter((entry) =>
      imageExtensions.some(ext => entry.entryName.toLowerCase().endsWith(ext))
    );

    const uploaded = await Promise.all(
      imageFiles.map(async (entry) => {
        const buffer = entry.getData();
        const mimeType = `image/${entry.entryName.split('.').pop()}`;
        return await uploadToCloudinary(buffer, mimeType, module);
      })
    );

    return uploaded.map(file => file._id);
  };

  if (req.files?.zip) {
    const zipFile = Array.isArray(req.files.zip) ? req.files.zip[0] : req.files.zip;
    const uploadedImageIds = await processZip(zipFile.buffer, req.body.module);
    return uploadedImageIds; // return array of image _ids
  }

  // existing image upload logic...
  // featured_image, gallery, slider

  return {};
};

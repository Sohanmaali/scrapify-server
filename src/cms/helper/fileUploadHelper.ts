
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';
import * as fs from 'fs';

export const ImageUploadHelper = async (req, fileModel) => {
  const uploadImage = async (file) => {
    const year = new Date().getFullYear();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const month = monthNames[new Date().getMonth()];

    // Create the upload path
    const uploadPath = join(process.cwd(), 'public', 'images', year.toString(), month);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generate a new filename
    const fileExtension = extname(file.originalname);
    const originalName = basename(file.originalname, fileExtension);
    const timestamp = Date.now();
    const newFileName = `${timestamp}-${originalName}${fileExtension}`;

    const fileData = file?.buffer || fs?.readFileSync(file.path);  // Use buffer if available

    const filePath = join(uploadPath, newFileName);

    // Write the file to the final destination
    fs.writeFileSync(filePath, fileData);

    const relativeFilePath = filePath.replace(process.cwd() + '\\public', '');
    const fileDetails = {
      destination: uploadPath,
      filepath: relativeFilePath,
      filename: newFileName,
      mimeType: file.mimetype,
      size: file.size,
      module: "",
    };

    // Save the file details to the database
    const savedFile = await fileModel.create(fileDetails);
    return savedFile;
  };

  const processFiles = async (files) => {
    return await Promise.all(files.map((file) => uploadImage(file)));
  };

  let result = {};

  // Handle single featured_image (either req.files.featured_image or req.file)
  if (req.files?.featured_image) {
    const featuredImageFile = Array.isArray(req.files.featured_image)
      ? req.files.featured_image[0]
      : req.files.featured_image;

    const featuredImageData = await uploadImage(featuredImageFile);
    return featuredImageData._id;
  } else if (req.file) {
    console.log("single file");
    
    const featuredImageData = await uploadImage(req.file);
    return featuredImageData._id;
  }

  // Handle multiple files in gallery
  if (req.files?.gallery) {
    const galleryFiles = req.files.gallery;
    const galleryImages = await processFiles(galleryFiles);
    result = galleryImages.map((file) => file._id); // Store IDs as an array
  }

  return result; // Return the result object containing IDs
};

import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

export class ImageUploadHelper {
  static imageFileFilter(req: any, file: any, callback: any) {
    const allowedExtensions = /jpg|jpeg|png|gif/;
    const extension = extname(file.originalname).toLowerCase();
    if (!allowedExtensions.test(extension)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  }

  static storage = diskStorage({
    destination: (req, file, callback) => {
      const uploadPath = join(process.cwd(), 'public', 'uploads'); // Save to `public/uploads` folder
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory exists
      }
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const fileExtension = extname(file.originalname);
      const fileName = `image-${Date.now()}${fileExtension}`; // Generate a unique file name
      callback(null, fileName);
    },
  });
}

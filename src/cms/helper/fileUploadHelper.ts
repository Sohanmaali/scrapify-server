
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';
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
      // Get current year and month
      const year = new Date().getFullYear();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = monthNames[new Date().getMonth()]; // Get month name

      // Set upload path to `public/images/year/month`
      const uploadPath = join(process.cwd(), 'public', 'images', year.toString(), month);

      // Ensure the directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const fileExtension = extname(file.originalname);
      const originalName = basename(file.originalname, fileExtension); // Get original filename without extension
      const currentDate = Date.now() // Format: YYYY-MM-DD

      const newFileName = `${currentDate}-${originalName}${fileExtension}`;

      // Return newFileName
      callback(null, newFileName);
    },
  });
}

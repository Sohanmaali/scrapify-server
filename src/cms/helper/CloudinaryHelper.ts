
// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });



// export const ImageUploadHelper = async (req, fileModel) => {

//     const uploadImage = async (file) => {
//         const year = new Date().getFullYear();
//         const monthNames = [
//             'January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December',
//         ];
//         const month = monthNames[new Date().getMonth()];

//         const uploadPath = `images/${year}/${month}`;

//         try {

//             console.log("-=--=-=-=-=-=uploadResult-=-====-=111", process.env.CLOUDINARY_CLOUD_NAME);
//             console.log("-=--=-=-=-=-=uploadResult-=-====-=111", process.env.CLOUDINARY_API_KEY);
//             console.log("-=--=-=-=-=-=uploadResult-=-====-=111", process.env.CLOUDINARY_API_SECRET);

//             const uploadResult = await cloudinary.uploader.upload(file?.path, {
//                 folder: uploadPath,
//             });


//             const fileDetails = {
//                 destination: uploadPath,
//                 filepath: uploadResult.secure_url,
//                 filename: uploadResult.secure_url.split('/').pop(),
//                 public_id: uploadResult.public_id,
//                 mimeType: file.mimetype,
//                 size: file.size,
//                 module: req.body.module,
//             };

//             const savedFile = await fileModel.create(fileDetails);
//             return savedFile;
          
//         } catch (error) {
//             console.error('Cloudinary upload failed:', error);
//             throw new Error('Failed to upload image to Cloudinary.');
//         }
//     }




//     const processFiles = async (files) => {
//         return await Promise.all(files.map((file) => uploadImage(file)));
//     };

//     let result = {};

//     // Handle single featured_image (either req.files.featured_image or req.file)
//     if (req.files?.featured_image) {
//         const featuredImageFile = Array.isArray(req.files.featured_image)
//             ? req.files.featured_image[0]
//             : req.files.featured_image;           

//         const featuredImageData: any = await uploadImage(featuredImageFile);
//         return featuredImageData._id;
//     } else if (req.file) {
//         console.log("single file");

//         const featuredImageData: any = await uploadImage(req.file);
//         return featuredImageData._id;
//     }

//     // Handle multiple files in gallery
//     if (req.files?.gallery) {
//         const galleryFiles = req.files.gallery;
//         const galleryImages = await processFiles(galleryFiles);
//         result = galleryImages.map((file) => file._id); // Store IDs as an array
//     }
//     if (req.files?.slider) {
//         const sliderFiles = req.files.slider;
//         const sliderImages = await processFiles(sliderFiles);
//         result = sliderImages.map((file) => file._id); // Store IDs as an array
//     }

//     return result; // Return the result object containing IDs

// }

import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// dotenv.config(); // Load environment variables

// // Ensure environment variables are loaded (if not already)
// if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//     throw new Error('Cloudinary environment variables are not set. Please check your .env file.');
// }

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const ImageUploadHelper = async (req, fileModel) => {
    const uploadImage = async (file) => {
        const year = new Date().getFullYear();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        const month = monthNames[new Date().getMonth()];

        const uploadPath = `images/${year}/${month}`;

        try {
            // Debugging: Log environment variables
            console.log("Cloudinary Config:");
            console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
            console.log("API Key:", process.env.CLOUDINARY_API_KEY);
            console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

            // Upload file to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file?.path, {
                folder: uploadPath,
            });

            // Prepare file details for saving
            const fileDetails = {
                destination: uploadPath,
                filepath: uploadResult.secure_url,
                filename: uploadResult.secure_url.split('/').pop(),
                public_id: uploadResult.public_id,
                mimeType: file.mimetype,
                size: file.size,
                module: req.body.module,
            };

            // Save file details to database
            const savedFile = await fileModel.create(fileDetails);
            return savedFile;
        } catch (error) {
            console.error('Cloudinary upload failed:', error);
            throw new Error('Failed to upload image to Cloudinary.');
        }
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

        const featuredImageData: any = await uploadImage(featuredImageFile);
        return featuredImageData._id;
    } else if (req.file) {
        console.log("single file");

        const featuredImageData: any = await uploadImage(req.file);
        return featuredImageData._id;
    }

    // Handle multiple files in gallery
    if (req.files?.gallery) {
        const galleryFiles = req.files.gallery;
        const galleryImages = await processFiles(galleryFiles);
        result = galleryImages.map((file) => file._id); // Store IDs as an array
    }
    if (req.files?.slider) {
        const sliderFiles = req.files.slider;
        const sliderImages = await processFiles(sliderFiles);
        result = sliderImages.map((file) => file._id); // Store IDs as an array
    }

    return result; // Return the result object containing IDs
};

const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

// Memory storage (we'll upload to Cloudinary manually)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedPdfTypes = ['application/pdf'];

  if (allowedImageTypes.includes(file.mimetype) || allowedPdfTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only JPEG, PNG, WEBP images and PDF files are allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB max
});

// Upload to Cloudinary helper
const uploadToCloudinary = async (fileBuffer, folder, resourceType = 'image', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `portfolio/${folder}`,
      resource_type: resourceType,
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(new AppError('Upload to Cloudinary failed: ' + error.message, 500));
      resolve({ url: result.secure_url, publicId: result.public_id });
    });

    uploadStream.end(fileBuffer);
  });
};

// Delete from Cloudinary helper
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };

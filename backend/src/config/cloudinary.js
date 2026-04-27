const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

let upload = null;

const initializeCloudinary = () => {
  // Validate Cloudinary configuration
  const requiredCloudinaryVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missingVars = requiredCloudinaryVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    throw new Error(`Missing Cloudinary config: ${missingVars.join(', ')}`);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'wedplano/venues',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      resource_type: 'auto',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

  upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB (reduced from 50MB)
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
      }
    },
  });

  return upload;
};

// Lazy initialize on first access
const getUpload = () => {
  if (!upload) {
    initializeCloudinary();
  }
  return upload;
};

module.exports = { 
  cloudinary, 
  get upload() {
    return getUpload();
  },
  initializeCloudinary 
};

const multer = require('multer');
const APIError = require('../utils/APIError');

// Use memory storage instead of disk
const storage = multer.memoryStorage();

const createUploader = ({ allowedTypes, maxSize, fieldName }) => {
  const fileFilter = (req, file, cb) => {
    const allowed = new RegExp(allowedTypes.join('|'));

    const extname = allowed.test(file.originalname.toLowerCase());
    const mimetype = allowed.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new APIError(`Only ${allowedTypes.join(', ')} files are allowed`, 400), false);
    }
  };

  return multer({
    storage, // 👈 no disk, only memory
    limits: { fileSize: maxSize },
    fileFilter,
  }).array(fieldName, 5);
};

const uploadProductImages = createUploader({
  allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
  maxSize: 5 * 1024 * 1024,
  fieldName: 'images',
});

module.exports = {
  uploadProductImages,
};

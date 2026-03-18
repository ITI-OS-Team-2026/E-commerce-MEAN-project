const multer = require('multer');
const path = require('path');
const APIError = require('../utils/APIError');

const storage = multer.memoryStorage();

const profilePictureFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new APIError('Profile pictures must be jpg or png only', 400));
  }
};

const postImagesFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new APIError('Only images (jpeg, jpg, png, webp) are allowed', 400));
  }
};

const uploadProfilePicture = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: profilePictureFilter,
}).single('profilePicture');

const uploadPostImages = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: postImagesFilter,
}).array('images', 10); // max 10 files

module.exports = {
  uploadProfilePicture,
  uploadPostImages,
};

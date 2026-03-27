const multer = require('multer');
const path = require('path');
const APIError = require('../utils/APIError');

const createUploader = ({ folder, allowedTypes, maxSize, fieldName }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/uploads/${folder}`); // 👈 dynamic folder
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowed = new RegExp(allowedTypes.join('|'));
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new APIError(`Only ${allowedTypes.join(', ')} files are allowed`, 400));
    }
  };

  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  }).array(fieldName, 5);
};

const uploadProductImages = createUploader({
  folder: 'products',
  allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
  maxSize: 5 * 1024 * 1024, // 5MB
  fieldName: 'image',
});

// const uploadProfilePicture = createUploader({
//   folder: "users",
//   allowedTypes: ["jpeg", "jpg", "png"],
//   maxSize: 2 * 1024 * 1024, // 2MB
//   fieldName: "profilePicture",
// });

// const uploadCategoryImage = createUploader({
//   folder: "categories",
//   allowedTypes: ["jpeg", "jpg", "png", "webp"],
//   maxSize: 3 * 1024 * 1024, // 3MB
//   fieldName: "image",
// });

module.exports = {
  uploadProductImages,
  // uploadProfilePicture,
  // uploadCategoryImage,
};

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const APIError = require('../utils/APIError');

const createUploader = ({ folder, allowedTypes, maxSize, fieldName }) => {
  const uploadPath = path.join(__dirname, `../public/uploads/${folder}`);

  // 👇 Create folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
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
  fieldName: 'images',
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

// middlewares/attachImageUrls.js
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const attachImageUrls = async (req, res, next) => {
  try {
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        });

        imageUrls.push(result.secure_url);

        fs.unlinkSync(file.path);
      }
    }

    // 👇 THIS IS THE MAGIC LINE
    req.body.images = imageUrls;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = attachImageUrls;

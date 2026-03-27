const cloudinary = require('../config/cloudinary');

const attachImageUrls = async (req, res, next) => {
  try {
    const imageUrls = [];

    // ✅ Check if files exist
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // ❗ IMPORTANT: Using upload_stream because we use buffer
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' }, // upload folder in Cloudinary
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );

          // ❗ THIS is the key: send file buffer (NOT file.path)
          stream.end(file.buffer);
        });

        imageUrls.push(result.secure_url);
      }
    }

    // ❗ Add images to request body so Joi + controller can use it
    req.body.images = imageUrls;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = attachImageUrls;

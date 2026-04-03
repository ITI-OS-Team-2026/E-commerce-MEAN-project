const Product = require('../models/Product');
const APIError = require('../utils/APIError');
const cloudinary = require('../config/cloudinary');

/**
 * Helper: Extract public_id from Cloudinary URL
 */
const extractPublicId = (url) => {
  // Cloudinary URLs: .../upload/v123456/folder/public_id.ext
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
  return match ? match[1] : null;
};

/**
 * GET ALL PRODUCTS
 */
const getAllProducts = async (queryParams) => {
  const queryObj = { ...queryParams };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const parsedFilter = JSON.parse(queryStr);
  let dbQuery = Product.find({ ...parsedFilter, isdeleted: null });

  if (queryParams.search) {
    dbQuery = dbQuery.find({
      name: { $regex: queryParams.search, $options: 'i' },
    });
  }

  if (queryParams.sort) {
    const sortBy = queryParams.sort.split(',').join(' ');
    dbQuery = dbQuery.sort(sortBy);
  } else {
    dbQuery = dbQuery.sort('-createdAt');
  }

  const page = queryParams.page * 1 || 1;
  const limit = Math.min(queryParams.limit * 1 || 20, 100);
  const skip = (page - 1) * limit;

  dbQuery = dbQuery.skip(skip).limit(limit);

  const products = await dbQuery.populate('category', 'name');

  const totalCount = await Product.countDocuments({ ...parsedFilter, isdeleted: null });

  return {
    status: 'success',
    total: totalCount,
    results: products.length,
    data: { products },
  };
};

/**
 * GET PRODUCT BY ID
 */
const getProductById = async (productId) => {
  const product = await Product.findOne({ _id: productId, isdeleted: null })
    .populate('category')
    .populate('seller', 'name email');

  if (!product) {
    throw new APIError('Product not found', 404);
  }

  return product;
};

/**
 * CREATE PRODUCT
 */
const createProduct = async (productData) => {
  const product = new Product(productData);
  await product.save();
  return product;
};

/**
 * UPDATE PRODUCT
 */
const updateProduct = async (productId, updateData) => {
  const product = await Product.findOne({ _id: productId, isdeleted: null });

  if (!product) {
    throw new APIError('Product not found', 404);
  }

  // ✅ If new images are provided → delete old ones from Cloudinary
  if (updateData.images && product.images?.length > 0) {
    for (const url of product.images) {
      const publicId = extractPublicId(url);

      await cloudinary.uploader.destroy(publicId);
    }
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId, isdeleted: null },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedProduct;
};

/**
 * DELETE PRODUCT (soft delete + optional Cloudinary cleanup)
 */
const deleteProduct = async (productId) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, isdeleted: null },
    { isdeleted: new Date() },
    { new: true },
  );

  if (!product) {
    throw new APIError('Product not found', 404);
  }

  // ✅ OPTIONAL: delete images from Cloudinary

  if (product.images?.length > 0) {
    for (const url of product.images) {
      const publicId = extractPublicId(url);
      await cloudinary.uploader.destroy(publicId);
    }
  }

  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

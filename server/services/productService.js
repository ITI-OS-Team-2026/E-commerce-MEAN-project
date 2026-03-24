const Product = require('../models/product');
const APIError = require('../utils/APIError');

const getAllProducts = async (queryParams) => {
  try {
    const queryObj = { ...queryParams };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let dbQuery = Product.find(JSON.parse(queryStr));

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
    const limit = queryParams.limit * 1 || 10;
    const skip = (page - 1) * limit;
    dbQuery = dbQuery.skip(skip).limit(limit);

    const products = await dbQuery.populate('category', 'name');

    return {
      status: 'success',
      results: products.length,
      data: { products },
    };
  } catch (err) {
    throw new APIError(`Failed to fetch products: ${err.message}`);
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Product.findById({ _id: productId, isdeleted: null })
      .populate('category')
      .populate('seller', 'name email');
    if (!product) {
      throw new APIError('Product not found');
    }
    return product;
  } catch (err) {
    throw new APIError(`Failed to fetch product: ${err.message}`);
  }
};

const createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    await product.save();
    return product;
  } catch (err) {
    throw new APIError(`Failed to create product: ${err.message}`);
  }
};

const updateProduct = async (productId, updateData) => {
  try {
    const product = await Product.findByIdAndUpdate(
      { _id: productId, isdeleted: null },
      updateData,
      { new: true, runValidators: true },
    );
    if (!product) {
      throw new APIError('Product not found');
    }
    return product;
  } catch (err) {
    throw new APIError(`Failed to update product: ${err.message}`);
  }
};

const deleteProduct = async (productId) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId, isdeleted: null },
      { isdeleted: new Date() },
      { new: true },
    );
    if (!product) {
      throw new APIError('Product not found');
    }
    return product;
  } catch (err) {
    throw new APIError(`Failed to delete product: ${err.message}`);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productService');

const getAllProductsController = async (req, res, next) => {
  try {
    const result = await getAllProducts(req.query);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getProductByIdController = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const createProductController = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user.userId, // ✅ keep from auth only
    };

    const product = await createProduct(productData);

    res.status(201).json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const updateProductController = async (req, res, next) => {
  try {
    // ✅ req.body already includes images from middleware (if any)
    const product = await updateProduct(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProductController = async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
};

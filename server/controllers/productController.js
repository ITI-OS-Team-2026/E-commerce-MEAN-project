const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productService');
const APIError = require('../utils/APIError');

const getAllProductsController = async (req, res) => {
  try {
    const result = await getAllProducts(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: 'fail',
      message: err.message
    });
  }
};

const getProductByIdController = async (req, res) => {    
    try {
        const product = await getProductById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
};

const createProductController = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user._id
    };
    const product = await createProduct(productData);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });  
    }
    res.status(200).json({
      message: 'Product deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

module.exports = {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController
};
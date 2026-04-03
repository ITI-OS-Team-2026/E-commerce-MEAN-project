const {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
} = require('../controllers/productController');
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const restrictTo = require('../middlewares/restrictTo');
const validate = require('../middlewares/validate');
const schemas = require('../schemas/Product');
const { uploadProductImages } = require('../middlewares/upload');
const attachImageUrls = require('../middlewares/attachImageUrl');

// ── Public routes ───────────────────────────────────────────
router.get('/', getAllProductsController);
router.get('/:id', getProductByIdController);

// ── Protected routes (sellers only) ─────────────────────────
router.post(
  '/',
  authenticate,
  restrictTo('seller'),
  uploadProductImages,
  attachImageUrls,
  validate(schemas.createProductSchema),
  createProductController,
);
router.patch(
  '/:id',
  authenticate,
  restrictTo('admin'),
  uploadProductImages,
  attachImageUrls,
  validate(schemas.updateProductSchema),
  updateProductController,
);
router.delete('/:id', authenticate, restrictTo('admin'), deleteProductController);

module.exports = router;

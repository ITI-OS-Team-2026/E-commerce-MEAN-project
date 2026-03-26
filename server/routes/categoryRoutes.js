const express = require('express');
const router = express.Router();
const {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require('../controllers/categoryController');
const { createCategorySchema, updateCategorySchema } = require('../schemas/Category');
const validate = require('../middlewares/validate');
const restrictTo = require('../middlewares/restrictTo');
const authenticate = require('../middlewares/authenticate');

router.post(
  '/',
  authenticate,
  restrictTo('admin'),
  validate(createCategorySchema),
  createCategoryController,
);
router.get('/', getAllCategoriesController);
router.get('/:id', getCategoryByIdController);
router.put(
  '/:id',
  authenticate,
  restrictTo('admin'),
  validate(updateCategorySchema),
  updateCategoryController,
);
router.delete('/:id', authenticate, restrictTo('admin'), deleteCategoryController);

module.exports = router;

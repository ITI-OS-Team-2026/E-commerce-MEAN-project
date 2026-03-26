const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');

const createCategoryController = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

const getCategoryByIdController = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategoryController = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategoryController = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
};

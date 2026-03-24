const {createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory} = require('../services/categoryService');
const APIError = require('../utils/APIError');

const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

const getCategoryByIdController = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(404).json({
      message: err.message
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({
      message: err.message
    });
  }
};

module.exports = {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController
};
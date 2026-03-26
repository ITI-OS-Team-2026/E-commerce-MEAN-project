const Category = require('../models/Category');
const APIError = require('../utils/APIError');

const createCategory = async (categoryData) => {
  const category = await Category.create(categoryData);
  return category;
};

const getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new APIError('Category not found', 404);
  }

  return category;
};

const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new APIError('Category not found', 404);
  }

  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new APIError('Category not found', 404);
  }

  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

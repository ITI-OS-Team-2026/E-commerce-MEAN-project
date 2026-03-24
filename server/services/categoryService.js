const Category = require('../models/category');
const APIError = require('../utils/APIError');

const createCategory = async (categoryData) => {
  try {
    const category = await Category.create(categoryData);
    return category;
  } catch (err) {
    throw new APIError(`Failed to create category: ${err.message}`);
  }
};

const getAllCategories = async () => {
  try {
    const categories = await Category.find();
    return categories;
  } catch (err) {
    throw new APIError(`Failed to fetch categories: ${err.message}`);
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new APIError('Category not found');
    }
    return category;
  } catch (err) {
    throw new APIError(`Failed to fetch category: ${err.message}`);
  }
};

const updateCategory = async (categoryId, updateData) => {
  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true },
    );
    if (!category) {
      throw new APIError('Category not found');
    }
    return category;
  } catch (err) {
    throw new APIError(`Failed to update category: ${err.message}`);
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      throw new APIError('Category not found');
    }
    return category;
  } catch (err) {
    throw new APIError(`Failed to delete category: ${err.message}`);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
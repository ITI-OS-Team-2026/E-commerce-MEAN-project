const Joi = require('joi');

const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Category name is required',
      'string.min': 'Category name must be at least 3 characters',
      'string.max': 'Category name must be at most 50 characters',
    }),
    slug: Joi.string().lowercase().required().messages({
      'string.empty': 'Slug is required',
    }),
    description: Joi.string().max(500).messages({
      'string.max': 'Description must be at most 500 characters',
    }),
    image: Joi.string().uri().messages({
      'string.uri': 'Image must be a valid URL',
    }),
  })
    .required()
    .unknown(false),
};

module.exports = createCategorySchema;

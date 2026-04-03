const Joi = require('joi');

const createProductSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 3 characters',
      'string.max': 'Product name must be at most 100 characters',
    }),
    description: Joi.string().min(10).required().messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
    }),
    price: Joi.number().min(15).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be at least 15',
      'any.required': 'Price is required',
    }),
    category: Joi.string().required().messages({
      'string.empty': 'Category is required',
    }),
    images: Joi.array().items(
      Joi.string().uri().messages({
        'string.uri': 'Each image must be a valid URL',
      }),
    ),
    stock: Joi.number().min(0).messages({
      'number.base': 'Stock must be a number',
      'number.min': 'Stock cannot be negative',
    }),
  })
    .required()
    .unknown(false),
};

module.exports = createProductSchema;

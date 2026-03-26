const Joi = require('joi');

const updateProductSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(100).messages({
      'string.empty': 'Product name cannot be empty',
      'string.min': 'Product name must be at least 3 characters',
      'string.max': 'Product name must be at most 100 characters',
    }),
    description: Joi.string().min(10).messages({
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must be at least 10 characters',
    }),
    price: Joi.number().min(0).messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
    }),
    category: Joi.string().messages({
      'string.empty': 'Category cannot be empty',
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
    isdeleted: Joi.date().allow(null).messages({
      'date.base': 'isdeleted must be a valid date',
    }),
    seller: Joi.string().messages({
      'string.empty': 'Seller ID cannot be empty',
    }),
  })
    .required()
    .unknown(false),
};

module.exports = updateProductSchema;

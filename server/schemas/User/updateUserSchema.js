const Joi = require('joi');

const updateUserSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must be at most 50 characters',
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        'string.email': 'Email must be a valid email address',
      }),
    phone: Joi.string().min(7).max(15).messages({
      'string.min': 'Phone must be at least 7 digits',
      'string.max': 'Phone must be at most 15 digits',
    }),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
    }),
    // only relevant if user is a seller
    storeName: Joi.string().min(3).max(100).messages({
      'string.min': 'Store name must be at least 3 characters',
      'string.max': 'Store name must be at most 100 characters',
    }),
  })
    .required()
    .unknown(false),
};

module.exports = updateUserSchema;

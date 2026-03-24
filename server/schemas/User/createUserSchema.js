const Joi = require('joi');

const createUserSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must be at most 50 characters',
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
      }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
    phone: Joi.string().min(7).max(15).messages({
      'string.min': 'Phone must be at least 7 digits',
      'string.max': 'Phone must be at most 15 digits',
    }),
    // admin cannot self-register
    role: Joi.string().valid('customer', 'seller').default('customer').messages({
      'any.only': "Role must be either 'customer' or 'seller'",
    }),
  })
    .required()
    .unknown(false),
};

module.exports = createUserSchema;

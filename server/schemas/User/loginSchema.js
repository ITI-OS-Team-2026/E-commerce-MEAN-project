const Joi = require('joi');

const loginSchema = {
  body: Joi.object({
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
  })
    .required()
    .unknown(false),
};

module.exports = loginSchema;

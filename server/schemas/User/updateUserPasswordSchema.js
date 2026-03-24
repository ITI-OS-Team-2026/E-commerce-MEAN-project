const Joi = require('joi');

const updateUserPasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required().messages({
      'string.empty': 'Old password is required',
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required',
    }),
  })
    .required()
    .unknown(false),
};

module.exports = updateUserPasswordSchema;

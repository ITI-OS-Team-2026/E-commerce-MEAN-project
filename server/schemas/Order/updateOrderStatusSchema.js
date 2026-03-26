const Joi = require('joi');

const updateOrderStatusSchema = {
  body: Joi.object({
    status: Joi.string()
      .valid('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')
      .required()
      .messages({
        'any.only': 'Invalid status value',
        'any.required': 'Status is required'})
  }).required(),
};

module.exports = updateOrderStatusSchema;

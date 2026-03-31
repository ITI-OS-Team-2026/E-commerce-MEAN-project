const Joi = require('joi');

const updateOrderStatusSchema = {
  body: Joi.object({
    status: Joi.string()
      .valid('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')
      .required()
      .messages({
        'any.only':
          'Status must be one of: pending, confirmed, packed, shipped, delivered, cancelled',
        'any.required': 'Status is required',
      }),
  }),
};

module.exports = updateOrderStatusSchema;

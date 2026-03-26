const Joi = require('joi');

const createOrderSchema = {
  body: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required().messages({
            'string.empty': 'Product ID is required',
          }),
          quantity: Joi.number().integer().min(1).required().messages({
            'number.base': 'Quantity must be a number',
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required',
          }),
          price: Joi.number().min(0).required().messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative',
            'any.required': 'Price is required',
          }),
        }))
      .min(1)
      .required()
      .messages({
        'array.min': 'Order must contain at least one item',
        'any.required': 'Items are required'}),
    shippingAddress: Joi.object({
      street: Joi.string().required().messages({ 'string.empty': 'Street is required' }),
      city: Joi.string().required().messages({ 'string.empty': 'City is required' }),
      state: Joi.string().required().messages({ 'string.empty': 'State is required' }),
      country: Joi.string().required().messages({ 'string.empty': 'Country is required' }),
      zip: Joi.string().required().messages({ 'string.empty': 'ZIP is required' }),
    })
      .required()
      .messages({ 'any.required': 'Shipping address is required' }),
  }).required(),
};

module.exports = createOrderSchema;

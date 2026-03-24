const joi = require('joi');

const createProductSchema = {
  body: joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().positive().required(),
    category: joi.string().required(),
    stock: joi.number().integer().min(0).required(),
    images: joi.array().items(joi.string().uri()).required(),
  }),
};

const updateProductSchema = {
  body: joi.object({
    name: joi.string().optional(),
    description: joi.string().optional(),
    price: joi.number().positive().optional(),
    category: joi.string().optional(),
    stock: joi.number().integer().min(0).optional(),
    images: joi.array().items(joi.string().uri()).optional(),
  }),
};

module.exports = {
  createProductSchema,
  updateProductSchema,
};

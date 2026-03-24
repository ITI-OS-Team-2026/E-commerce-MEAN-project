const joi = require('joi');

const createProductSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().positive().required(),
  category: joi.string().required(),
  stock: joi.number().integer().min(0).required(),
  images: joi.array().items(joi.string().uri()).required()
});

const updateProductSchema = joi.object({
  name: joi.string(),
  description: joi.string(),
  price: joi.number().positive(),
  category: joi.string(),
  stock: joi.number().integer().min(0),
  images: joi.array().items(joi.string().uri())
}).min(1);



module.exports = {
  createProductSchema,
  updateProductSchema
};

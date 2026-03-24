const joi = require('joi');

const createCategorySchema = {
  body: joi.object({
    name: joi.string().trim().required(),
    slug: joi.string().lowercase().trim().required(),
    description: joi.string().optional(),
    image: joi.string().uri().optional()
  })
};

const updateCategorySchema = {
  body: joi.object({
    name: joi.string().trim().optional(),
    slug: joi.string().lowercase().trim().optional(),
    description: joi.string().optional(),
    image: joi.string().uri().optional()
  })
};

module.exports = {
  createCategorySchema,
  updateCategorySchema
};
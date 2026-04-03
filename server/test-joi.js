const Joi = require('joi');
const schema = Joi.object({
  price: Joi.number().min(15).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  })
});
const val = schema.validate({ price: "10" }, { abortEarly: true });
console.log(JSON.stringify(val.error.details, null, 2));
